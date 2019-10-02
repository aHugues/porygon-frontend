export default function setGlobals() {
  global.window.localStorage = {
    items: {},
    setItem: (key, value) => { this.items[key] = value; },
    getItem: key => this.items[key],
  };
}
