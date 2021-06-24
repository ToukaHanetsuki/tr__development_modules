/**
 * Objectを操作する上で便利な汎用的なクラスメソッド
 *
 * @export
 * @class ObjectModule
 */
export class ObjectModule {

  /**
   * objをブラケット記法で取得する
   *
   * @static
   * @template T
   * @template K
   * @param {T} obj
   * @param {K} key
   * @return {*}  {T[K]}
   * @memberof ObjectModule
   */
  public static accessByBracket<T, K extends keyof T>(obj: T, key: K): T[K] {
    return obj[key];
  };

  /**
   * objから任意のkeyを選択し、オブジェクトを作成する。
   *
   * @static
   * @template T
   * @template K
   * @param {T} obj
   * @param {...K[]} keys
   * @return {*}  {Pick<T, K>}
   * @memberof ObjectModule
   */
  public static pick<T, K extends keyof T>(obj: T, ...keys: K[]): Pick<T, K> {
    return this.basePick(obj, (k, v) => {
      if (keys.includes(k as K)) return { [k]: v };
    });
  };

  /**
   * objから任意のkey以外を選択し、オブジェクトを作成する。
   *
   * @static
   * @template T
   * @template K
   * @param {T} obj
   * @param {...K[]} keys
   * @return {*}  {Omit<T, K>}
   * @memberof ObjectModule
   */
  public static omit<T, K extends keyof T>(obj: T, ...keys: K[]): Omit<T, K> {
    return this.basePick(obj, (k, v) => {
      if (!keys.includes(k as K)) return { [k]: v };
    });
  };

  /**
   * pick, omitで利用する共通関数
   * collBackのオブジェクトを新しいオブジェクトとして戻す。
   *
   * @private
   * @static
   * @template T
   * @template K
   * @template R
   * @param {T} obj
   * @param {((k: K, v: T[K]) => {[x: string]: T[K]}|void)} collBack
   * @return {*}  {R}
   * @memberof ObjectModule
   */
  private static basePick<T, K extends keyof T, R>(obj: T, collBack: (k: K, v: T[K]) => {[x: string]: T[K]}|void): R {
    return Object.assign({}, ...Object.entries(obj).map(([k, v]) => collBack(k as K, v)).filter(v => v));
  };

  /**
   * ネストの深いオブジェクトをマージする
   * ※ 関数はマージできないので注意
   *
   * @static
   * @template T
   * @template K
   * @param {T} target
   * @param {T} source
   * @return {*}  {T}
   * @memberof ObjectModule
   */
  public static mergeDeeply<T extends Record<string, unknown>, K extends keyof T>(target: T, source: T): T {
    let result = Object.assign({}, target) as T;

    if (this.isObject(target) && this.isObject(source)) {
      Object.entries(source).forEach(([sourceKey, sourceValue]) => {
        const targetValue = target[sourceKey];
        if (Array.isArray(sourceValue) && Array.isArray(targetValue)) {
          result[sourceKey as K] = targetValue.concat(...sourceValue) as T[K];
        }
        else if (this.isObject(sourceValue) && target.hasOwnProperty(sourceKey)) {
          result[sourceKey as K] = this.mergeDeeply(targetValue as Record<string, unknown>, sourceValue as Record<string, unknown>) as T[K];
        }
        else {
          Object.assign(result, {[sourceKey]: sourceValue});
        }
      })
    }

    return result;
  }

  /**
   * Objectかどうか判定する
   *
   * @private
   * @static
   * @param {*} obj
   * @return {*}  {boolean}
   * @memberof ObjectModule
   */
  private static isObject(obj: any): boolean {
    return obj && typeof obj === 'object' && !Array.isArray(obj);
  }
}
