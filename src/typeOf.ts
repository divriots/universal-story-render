export function typeOf(obj: any): string {
  const type = Object.prototype.toString.call(obj).slice(8, -1);
  
  if (type === "Object") {
    if (typeof obj[Symbol.iterator] === "function") {
      return "Iterable";
    }
    if (String(obj.$$typeof) === "Symbol(react.element)") {
      return "React";
    }
    if (obj.$flags$ !== undefined) {
      return "Stencil";
    }
    if (obj.constructor === undefined) {
      return "Preact";
    }
    if (obj._$litType$ !== undefined) {
      // lit-html v2
      return "TemplateResult";
    }
    if ("nodeName" in obj && "children" in obj) {
      return "Omi";
    }
    if (
      "css" in obj &&
      "template" in obj &&
      "exports" in obj &&
      "name" in obj
    ) {
      return "Riot";
    }
    if ("Component" in obj && typeOf(obj.Component) === "Riot") {
      return "RiotStory";
    }
    if ("Component" in obj && typeOf(obj.Component) === "Svelte") {
      return "SvelteStory";
    }
    if ("__v_isVNode" in obj || "__scopeId" in obj || ("components" in obj && ("template" in obj || "render" in obj))) {
      return "Vue";
    }
    if (
      obj.component &&
      obj.component.__annotations__ &&
      obj.component.__annotations__[0] &&
      obj.component.__annotations__[0].ngMetadataName === "Component"
    ) {
      return "Angular";
    }
    return obj.constructor.name;
  } else if (type === "Array") {
    let hasOmi = false;
    for (const x of obj) {
      if (
        x === null ||
        typeof x === "boolean" ||
        typeof x === "string" ||
        typeof x === "number"
      ) {
      } else if (typeOf(x) === "Omi") hasOmi = true;
      else {
        hasOmi = false;
        break;
      }
    }
    if (hasOmi) return "Omi";
  } else if (type === "Function") {
    const fnStr = obj.toString();
    if ("CustomElementConstructor" in obj) {
      return "Lwc";
    }
    if (fnStr.includes("extends SvelteComponent") || fnStr.includes("extends ProxyComponent")) {
      return "Svelte";
    }
    if (
      fnStr.includes("_tmpl$.cloneNode(true)") ||
      fnStr.includes("_$createComponent(")
    ) {
      return "Solid";
    }
  } else if (obj instanceof Element && obj.nodeType === 1) {
    return "Element";
  }
  return type;
}
