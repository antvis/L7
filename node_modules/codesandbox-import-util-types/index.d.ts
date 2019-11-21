export interface IModule {
  content: string;
  isBinary: boolean;
  type?: "file";
}

export interface IDirectory {
  type: "directory";
}

export interface INormalizedModules {
  [path: string]: IModule | IDirectory;
}

export interface ISandboxFile {
  title: string;
  code: string;
  shortid: string;
  isBinary: boolean;
  directoryShortid: string | undefined | null;
}

export interface ISandboxDirectory {
  shortid: string;
  title: string;
  directoryShortid: string | undefined | null;
}

export type ITemplate =
  | "adonis"
  | "vue-cli"
  | "preact-cli"
  | "svelte"
  | "create-react-app-typescript"
  | "create-react-app"
  | "angular-cli"
  | "parcel"
  | "@dojo/cli-create-app"
  | "cxjs"
  | "gatsby"
  | "nuxt"
  | "next"
  | "reason"
  | "apollo"
  | "sapper"
  | "ember"
  | "nest"
  | "static"
  | "styleguidist"
  | "gridsome"
  | "vuepress"
  | "mdx-deck"
  | "quasar"
  | "node";

export interface ISandbox {
  title: string;
  description: string;
  tags: string;
  modules: ISandboxFile[];
  directories: ISandboxDirectory[];
  externalResources: string[];
  template: ITemplate;
  entry: string;
}
