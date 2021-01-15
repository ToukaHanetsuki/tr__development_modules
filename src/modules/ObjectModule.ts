export class ObjectModule {
  /** objをブラケット記法で取得する */
  public static accessByBracket<T>(obj: T, key: keyof T) {
    return obj[key];
  };

  /** objから任意のkeyを選びオブジェクトを作成する。 */
  public static pick<T, K extends keyof T>(obj: T, ...key: K[]): Pick<T, K> {
    return this.basePick(obj, (k, v) => {
      if (key.includes(k as K)) return { [k]: v };
    });
  };

  /** objから任意のkeyを意外を選びオブジェクトを作成する。 */
  public static omit<T, K extends keyof T>(obj: T, ...key: K[]): Omit<T, K> {
    return this.basePick(obj, (k, v) => {
      if (!key.includes(k as K)) return { [k]: v };
    });
  };

  /**
   * pick, omitで利用する共通関数
   * collBackのオブジェクトを新しい一つのオブジェクトとして戻す。
   */
  private static basePick<T, K extends keyof T, R>(obj: T, collBack: (k: K, v: T[K]) => {[x: string]: T[K]}): R {
    return Object.assign({}, ...Object.entries(obj).map(([k, v]) => collBack(k as K, v)).filter(v => v));
  }
}
