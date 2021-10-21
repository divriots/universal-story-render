export async function render(
  require: (dep: string) => any,
  storyResult: any,
  storyType: string,
  div: HTMLElement
): Promise<boolean | VoidFunction> {
  switch (storyType) {
    case "Lwc": {
      div.appendChild(
        (await require("lwc")).createElement("c-story", { is: storyResult })
      );
      return true;
    }
    case "TemplateResult": {
      // lit-html
      (await require("lit-html")).render(storyResult, div);
      return true;
    }
    case "ViewTemplate": {
      // FAST
      storyResult.render({}, div);
      return true;
    }
    case "Hole": {
      // uhtml
      (await require("uhtml")).render(div, storyResult);
      return true;
    }
    case "LighterHole": {
      // lighterhtml
      (await require("lighterhtml")).render(div, storyResult);
      return true;
    }
    case "Stencil": {
      const stencilClient = await require("@stencil/core/internal/client");
      if ("BUILD" in stencilClient) {
        // 1.9
        stencilClient.renderVdom(
          // no idea what to put there
          {
            // $ancestorComponent$: undefined,
            // $flags$: 0,
            // $modeName$: undefined,
            $hostElement$: div,
            $cmpMeta$: {},
          },
          storyResult
        );
      } else {
        // 1.8
        stencilClient.renderVdom(
          div,
          // no idea what to put there
          {
            // $ancestorComponent$: undefined,
            // $flags$: 0,
            // $modeName$: undefined,
            // $hostElement$: div,
          },
          {
            // $flags$: 0,
            // $tagName$: 'div',
          },
          storyResult
        );
      }
      return true;
    }
    case "React": {
      const reactDom = (await require("react-dom"));
      reactDom.render(storyResult, div);
      return () => {
        reactDom.unmountComponentAtNode(div);
      };
    }
    case "Preact": {
      (await require("preact")).render(storyResult, div);
      return true;
    }
    case "Omi": {
      (await require("omi")).render(storyResult, div);
      return true;
    }
    case "Riot": {
      const createComp = (await require("riot")).component(storyResult);
      createComp(document.getElementById("root"), {});
      return true;
    }
    case "RiotStory": {
      const { Component, props, options } = storyResult;
      const createComp = (await require("riot")).component(Component);
      createComp(document.getElementById("root"), props, options);
      return true;
    }
    case "Solid": {
      (await require("solid-js/dom")).render(storyResult, div);
      return true;
    }
    case "Svelte": {
      const app = new storyResult({ target: div });
      return () => app.$destroy();
    }
    case "SvelteStory": {
      const { Component, ...rest } = storyResult;
      const app = new Component({ target: div, ...rest });
      return () => app.$destroy();
    }
    case "Vue": {
      const Vue = await require("vue");
      const app = storyResult.app;
      let _app: any;
      if (!app) {
        _app = Vue.createApp({
          setup: () => () => Vue.h(storyResult),
        });
        _app.mount(div);
      } else {
        const vNode = Vue.h(storyResult);
        vNode.appContext = app._context;
        Vue.render(vNode, div);
      }
      return () => {
        if(!app) {
          _app.unmount();
        }
        else {
          app.unmount();
        }
      };
    }
    case "Element":
    case "DocumentFragment": {
      div.appendChild(storyResult);
      return true;
    }
    case "Angular": {
      const { props, component: StoryComponent, markup } = storyResult;
      const { platformBrowserDynamic } = (await require("@angular/platform-browser-dynamic"));
      const { Component, NgModule, destroyPlatform } = (await require("@angular/core"));
      const { BrowserModule } = (await require("@angular/platform-browser"));
      const {
        imports = [],
        declarations = [],
        bootstrap = [],
        providers = [],
        schemas = [],
      } = storyResult.moduleMetadata;

      // Create a wrapper component to host the bindings
      @Component({
        selector: 'app-root',
        template: markup,
      })
      class AppComponent {};
      Object.keys(props).map((prop: string): string => AppComponent.prototype[prop] = props[prop]);

      // Create the default module
      @NgModule({
        imports: [BrowserModule, ...imports],
        declarations: [AppComponent, StoryComponent, ...declarations],
        bootstrap: [AppComponent, ...bootstrap],
        schemas,
        providers,
      })
      class AppModule {};

      // Init the app
      div.insertAdjacentHTML('beforeend', '<app-root></app-root>');
      platformBrowserDynamic().bootstrapModule(AppModule);
      return () => destroyPlatform();
    }
  }
  return false;
}
