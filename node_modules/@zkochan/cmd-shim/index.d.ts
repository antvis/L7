
interface Options {
  /**
   * If a PowerShell script should be created.
   *
   * @default true
   */
  createPwshFile?: boolean;

  /**
   * If a Windows Command Prompt script should be created.
   *
   * @default false
   */
  createCmdFile?: boolean;

  /**
   * If symbolic links should be preserved.
   *
   * @default false
   */
  preserveSymlinks?: boolean;

  /**
   * The path to the executable file.
   */
  prog?: string;

  /**
   * The arguments to initialize the `node` process with.
   */
  args?: string;

  /**
   * The value of the $NODE_PATH environment variable.
   *
   * The single `string` format is only kept for legacy compatibility,
   * and the array form should be preferred.
   */
  nodePath?: string | string[];
}

declare function cmdShim(src: string, to: string, opts: Options): Promise<void>
declare namespace cmdShim {
  function cmdShimIfExists(src: string, to: string, opts: Options): Promise<void>
}
export = cmdShim;
