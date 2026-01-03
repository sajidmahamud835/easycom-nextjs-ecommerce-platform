declare module "*.css" {
  interface CSSModule {
    [className: string]: string;
  }
  const cssModule: CSSModule;
  export default cssModule;
}

declare module "*.png" {
  const content: any;
  export default content;
}
