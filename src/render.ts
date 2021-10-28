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
      const { props, component: StoryComponent } = storyResult;
      const { platformBrowserDynamic } = (await require("@angular/platform-browser-dynamic"));
      const { Component, NgModule, destroyPlatform, ComponentFactoryResolver, ViewChild, ViewContainerRef} = (await require("@angular/core"));
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
        selector: div,
        template: '<ng-container #container></ng-container>',
      })
      class AppComponent {
        @ViewChild('container', { read: ViewContainerRef }) vc: ViewContainerRef;

        constructor(private resolver: ComponentFactoryResolver) {}

        ngAfterViewInit() {
          const componentFactory = this.resolver.resolveComponentFactory(StoryComponent);
          const componentRef = this.container.createComponent(componentFactory);

          // Pass props to the component
          const propsMetadata = StoryComponent.__prop__metadata__;

          Object.keys(props).map((prop) => {
            const isOutput = propsMetadata[prop] && propsMetadata[prop][0].ngMetadataName === 'Output';
            if (isOutput) {
              componentRef.instance[prop].subscribe(props[prop]);
            } else {
              componentRef.instance[prop] = props[prop]
            }
          });
        }
      };

      // Create the default module
      @NgModule({
        imports: [BrowserModule, ...imports],
        declarations: [AppComponent, StoryComponent, ...declarations],
        bootstrap: [AppComponent, ...bootstrap],
        entryComponents: [StoryComponent],
        schemas,
        providers,
      })
      class AppModule {};

      // Init the app
      platformBrowserDynamic().bootstrapModule(AppModule);
      return () => destroyPlatform();
    }
  }
  return false;
}
