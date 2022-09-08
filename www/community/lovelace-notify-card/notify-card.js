class NotifyCard extends HTMLElement {
  setConfig(config) {
    if (!config.target) {
      throw new Error('You need to define one or more targets');
    }
    this.config = config;
    if (typeof this.config.target == "string") {
      this.targets = [this.config.target];
    } else if (Array.isArray(this.config.target)) {
      this.targets = this.config.target
    } else {
      throw new Error('Target needs to be a list or single target');
    }
    this.render();
  }

  render() {
    if (!this.content) {
      this.card = document.createElement('ha-card');
      this.content = document.createElement('div');
      this.content.style.padding = '0 16px 16px';
      this.card.appendChild(this.content);
      this.appendChild(this.card);
    }
    this.card.header = this.config.card_title ?? "Send Notification";
    this.content.innerHTML = "";

    if(this.config.notification_title instanceof Object){
      let title_label = this.config.notification_title.input ?? "Notification Title"
      this.content.innerHTML += `
      <div style="display: flex">
        <paper-input id="notification_title" style="flex-grow: 1" label="${title_label}"/>
      </div>
      `
    }
    
    let label = this.config.label ?? "Notification Text";
    this.content.innerHTML += `
    <div style="display: flex">   
      <paper-input id="notification_text" style="flex-grow: 1" label="${label}">
        <ha-icon-button id="send_button" slot="suffix">
          <ha-icon icon="mdi:send">
        </ha-icon-button>
      </paper-input>
    </div>
    `;
    this.content.querySelector("#send_button").addEventListener("click", this.send.bind(this), false);
    this.content.querySelector("#notification_text").addEventListener("keydown", this.keydown.bind(this), false);
  }

  send(){
    let msg = this.content.querySelector("#notification_text").value;
    let title = this.content.querySelector("#notification_title")?.value ?? this.config.notification_title;
    for (let t of this.targets) {
      let [domain, target = null] = t.split(".");
      if(target === null){
        target = domain;
        domain = "notify";
      }
      if(domain === "tts"){
        this.hass.callService(domain, target, {"entity_id": this.config.entity, "message": msg});
      } else {
        this.hass.callService(domain, target, {message: msg, title: title, data: this.config.data});
      }
    }
    this.content.querySelectorAll("paper-input").forEach(e => e.value = "");
  }

  keydown(e){
    if(e.code == "Enter") this.send();
  }
}

customElements.define('notify-card', NotifyCard);
