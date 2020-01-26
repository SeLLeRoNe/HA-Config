import glob
import logging
import time
import zipfile
from os import listdir, mkdir, path, remove, walk
from re import findall, match
from xml.dom import minidom

_LOGGER = logging.getLogger(__name__)
MODULE = 'custom_icons'
CACHE_PATH = 'custom_components/'+MODULE+'/cache/'
ICONS_PATH = 'custom_icons/'

class Icon:
	name = ''
	path = ''
	transform = ''

class IconGroup:
	name = ''
	baseCachePath = ''
	currentCachePath = ''
	newCachePath = ''
	iconFiles = []
	needRefresh = False

	def __init__(self, name, iconsPath):
		self.name = name
		self.cachePath = CACHE_PATH + name + '.js'
		findCurrentCachePath = [CACHE_PATH + file for file in listdir(CACHE_PATH) if match(name + '.\\w+.js', file)] 
		self.newCachePath = CACHE_PATH + name + '.' + str(round(time.time())) + '.js'
		self.iconFiles = [iconsPath+file for file in listdir(iconsPath) if path.isfile(iconsPath+file)]
		self.icons = {}

		# Check if the icon group needs to be refreshed
		if len(findCurrentCachePath) is 0:
			self.needRefresh = True
		else:
			self.currentCachePath = findCurrentCachePath[0]
			cacheFileCreationTime = path.getmtime(self.currentCachePath)
			files = [path.getmtime(file) for file in self.iconFiles];
			if len(files) is not 0:
				iconGroupLastModificationTime = max(files)
				self.needRefresh = cacheFileCreationTime < iconGroupLastModificationTime
			else:
				self.needRefresh = False

	def addIcon(self, icon):
		if icon.name not in self.icons.keys():
			self.icons[icon.name] = icon
		else:
			_LOGGER.warning("icon '%s' found twice in group '%s'", icon.name, self.name)

class Parser:
	iconGroups = []

	def checkIfNeeded(self):
		""" Return True if there is a need to refresh the cache file """
		needRefresh = False
		# If custom_icons folder does not exist
		if not path.exists(ICONS_PATH):
			mkdir(ICONS_PATH)
			needRefresh = True

		# If cache does not exist
		if not path.exists(CACHE_PATH):
			mkdir(CACHE_PATH)
			needRefresh = True

		if not needRefresh:
			# If a source file have been modified recently
			# Root group
			self._addIconGroupIfNeeded(IconGroup('custom', ICONS_PATH))
			# Custom groups in subdirectories
			for directory in self._listCustomIconGroups():
				if directory is 'mdi' or directory is 'custom' :
					_LOGGER.error("group name '%s' is not allowed", directory)
					continue
				self._addIconGroupIfNeeded(IconGroup(directory, ICONS_PATH+directory+'/'))
			needRefresh = len(self.iconGroups) > 0

		return needRefresh

	def _addIconGroupIfNeeded(self, iconGroup):
		""" Add an icon group to the list of groups if it needs to be refreshed """
		if iconGroup.needRefresh:
			self.iconGroups.append(iconGroup)


	def do(self):
		""" Build the cache files """
		self._parseFiles()
		for iconGroup in self.iconGroups:
			self._buildXml(iconGroup)


	def _buildXml(self, iconGroup):
		""" Generate the final xml containing the icons """
		# Check if there is icons loaded
		if len(iconGroup.icons) is 0:
			_LOGGER.warning("no icons loaded for group '%s'", iconGroup.name)
			return

		# Build the base document
		destDoc = minidom.Document();
		destRootNode = destDoc.createElementNS('http://www.w3.org/2000/svg', 'svg')
		destDoc.appendChild(destRootNode);

		# Insert the icons
		for name, icon in iconGroup.icons.items():
			symbol = destDoc.createElement('g')
			symbol.setAttribute("id", icon.name)
			symbol.setAttribute("transform", icon.transform)
			pathNode = destDoc.createElement('path')
			pathNode.setAttribute("d", icon.path)
			destDoc.firstChild.appendChild(symbol)
			symbol.appendChild(pathNode)

		# Create the cache file from the extracted icons and the template file
		ft = open('custom_components/'+MODULE+'/template.js', "r")
		template= ft.read()
		template = template.replace('{--ICONS--}', destDoc.toxml())
		template = template.replace('{--SOURCE--}', iconGroup.name)
		ft.close()
		fc = open(iconGroup.newCachePath, "w")
		fc.write(template)
		fc.close()

		if len(iconGroup.currentCachePath) is not 0:
			remove(iconGroup.currentCachePath)

		_LOGGER.info("icon group '%s' refreshed with %d icons", iconGroup.name, len(iconGroup.icons))

	def _parseFiles(self):
		""" Walk icon files to be parsed """
		for iconGroup in self.iconGroups:
			for filePath in iconGroup.iconFiles:
				try:
					if filePath.endswith('.svg'):
						self._parseSvgFile(iconGroup, filePath)
					elif filePath.endswith('.zip'):
						self._parseZipFile(iconGroup, filePath)
					else:
						_LOGGER.error("file '%s' unsupported", filePath)
				except:
					_LOGGER.error("parsing error on '%s'", filePath)
					_LOGGER.debug(sys.exc_info()[0])

	def _parseSvgFile(self, iconGroup, filePath):
		sourceDoc = minidom.parse(filePath)
		# Fontello
		fontNode = sourceDoc.getElementsByTagName('font')
		if len(fontNode) > 0 and fontNode[0].attributes['id'].value == 'fontello':
			self._parseFontelloSvgFile(iconGroup, sourceDoc)
			return True

		_LOGGER.error("file '%s' unsupported", filePath)

	def _parseZipFile(self, iconGroup, zipFilePath):
		""" Extract what's needed from a zip file, parse it and then delete it """
		zipf=zipfile.ZipFile(zipFilePath)
		success = False
		for fileInZip in zipf.namelist():
			if match('fontello-\w+\/font\/fontello\.svg', fileInZip):
				success = True
				self._parseFontelloZipFile(iconGroup, zipf, zipFilePath, fileInZip)
		if success:
			remove(zipFilePath)
			return True

		_LOGGER.error("file '%s' unsupported", filePath)


	def _parseFontelloSvgFile(self, iconGroup, sourceDoc):
		""" Parsing files generated from http://fontello.com """
		fontFaceNode = sourceDoc.getElementsByTagName('font-face')
		ascent = fontFaceNode[0].attributes['ascent'].value

		for glyph in sourceDoc.getElementsByTagName('glyph'):
			icon = Icon()
			icon.name = glyph.attributes['glyph-name'].value
			icon.path = glyph.attributes['d'].value
			icon.transform = "scale(1,-1) translate(0, -"+ascent+")"
			iconGroup.addIcon(icon)

	def _parseFontelloZipFile(self, iconGroup, zipf, zipFilePath, fileInZip):
		newSvgFilePath = zipFilePath+'.svg'
		fz = zipf.open(fileInZip, 'r')
		fe = open(newSvgFilePath, 'wb')
		fe.write(fz.read())
		fe.close()
		fz.close()
		self._parseSvgFile(iconGroup, newSvgFilePath)

	def listCacheFiles(self):
		""" list of existing cache files, with path """
		return ['/'+MODULE+'/cache/'+file for file in listdir(CACHE_PATH) if path.isfile(CACHE_PATH+file)]

	def _listCustomIconGroups(self):
		""" list the names of icons group from the folders custom_icons/
		This does not check the presence of icons
		This does not check the root folder"""
		return [d for d in listdir(ICONS_PATH) if path.isdir(ICONS_PATH+d)]

	def cleanUnusedCacheFiles(self):
		existingIconFiles = ['custom_components/' + cf for cf in self.listCacheFiles()]
		neededIconGroups = [ig for ig in self._listCustomIconGroups()]
		if(len([ICONS_PATH+file for file in listdir(ICONS_PATH) if path.isfile(ICONS_PATH+file)])) is not 0:
			neededIconGroups.append('custom')

		for cacheFile in existingIconFiles:
			iconGroupName = findall("cache/(\w+)\.", cacheFile )[0]
			if iconGroupName not in neededIconGroups:
				_LOGGER.info("removing cache file '%s'", cacheFile)
				remove(cacheFile)
