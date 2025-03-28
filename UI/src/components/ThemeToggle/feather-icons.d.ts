declare module "feather-icons" {
  export interface FeatherIcon {
    toSvg(params?: {
      width?: number | string;
      height?: number | string;
      "stroke-width"?: number | string;
      color?: string;
      class?: string;
    }): string;
  }

  const feather: {
    replace(options?: {
      class?: string;
      "stroke-width"?: number | string;
    }): void;
    icons: Record<string, FeatherIcon>;
  };

  export default feather;
}
