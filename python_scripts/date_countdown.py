##########
#
# Date Countdown
#
# A python_script for homeassistant by mf_social
#
##########


# Get the basic information to do the calculations
today = datetime.datetime.now().date()
name = data.get('name')
eventType = data.get('type')
countup = data.get('reverse' , False)
appendYear = data.get('append_year' , False)
defaultFriendlyName = ''
friendlyName = ''
numberOfDays = 0
defaultIcon = "mdi:calendar-star"

# Convert the date we got
dateStr = data.get('date')
dateSplit = dateStr.split("/")

dateDay = int(dateSplit[0])
dateMonth = int(dateSplit[1])
dateYear =  int(dateSplit[2])
date = datetime.date(dateYear , dateMonth , dateDay)


# Calculate the next occurrence
nextOccurYear = int(today.year)
nextOccur = datetime.date(nextOccurYear , dateMonth , dateDay)

# If countup (reverse == true)
if countup:
    defaultIcon = "mdi:calendar-arrow-right"
    years = today.year - date.year

    if nextOccur < today:
    #if event has passed this year, get days between then and today
        numberOfDays = (today - nextOccur).days

    else:
    # Count days from last year
        lastYearDate = datetime.date(today.year - 1 , dateMonth, dateDay)
        numberOfDays = (today - lastYearDate).days


# Regular countdown
else:
    if nextOccur < date:
        # date must be the first occurrence
        nextOccur = date

    if nextOccur < today:
        # if event has passed this year, nextOccur is next year
        nextOccurYear = nextOccurYear + 1
        nextOccur = datetime.date(nextOccurYear, dateMonth, dateDay)

    years = nextOccurYear - dateYear

    if years < 0:
      # if years is negative, then date is more than 365 days away
      # nextOccur will be the first occurrence
        years = 0

    numberOfDays = (nextOccur - today).days


# Set the default friendly name
if eventType.lower() == 'birthday':
    # add an apostophe for birthdays
    defaultFriendlyName = "{}'s {}".format(name , eventType)
else:
    defaultFriendlyName = "{} {}".format(name , eventType)


# Sanitise the entity_id to meet the criteria by
# replacing Scandanavian characters and spaces
rawName = "{}_{}".format(eventType , name)
rawName1 = rawName.replace("Æ" , "AE")
rawName2 = rawName1.replace("Ø" , "O")
rawName3 = rawName2.replace("Å" , "AA")
rawName4 = rawName3.replace("æ" , "ae")
rawName5 = rawName4.replace("ø" , "o")
rawName6 = rawName5.replace("å" , "aa")
safeName = rawName6.replace(" " , "_")
sensorName = "sensor.{}".format(safeName)


# Set friendly_name
rawFriendlyName = data.get('friendly_name', defaultFriendlyName)

if appendYear:
    #add Years to the end of friendly_name
    friendlyName = "{} ({})".format(rawFriendlyName , years)

else:
    friendlyName = "{}".format(rawFriendlyName)


# Send the sensor to homeassistant
hass.states.set(sensorName , numberOfDays ,
    {
        "icon" : data.get("icon", defaultIcon),
        "unit_of_measurement" : "days" ,
        "friendly_name" : "{}".format(friendlyName),
        "nextoccur" : "{}/{}/{}".format(nextOccur.day , nextOccur.month , nextOccur.year) ,
        "years" : years
    }
)
