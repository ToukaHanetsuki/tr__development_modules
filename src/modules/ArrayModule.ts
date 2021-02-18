
/**
 * 配列を操作する上で便利な汎用的なクラスメソッド
 *
 * @export
 * @class ArrayModule
 */
export class ArrayModule {
  /**
   * 対象のIDをもったObjectを配列から取り除く
   *
   * @static
   * @template T
   * @template K
   * @param {T[]} arr
   * @param {K} targetId
   * @return {*}  {(T|undefined)}
   * @memberof ArrayModule
   */
  public static removeByIdFromArray<T extends { id: K }, K>(arr: T[], targetId: K): T|undefined {
    const targetIndex = arr.findIndex(v => v.id === targetId);
    if (targetIndex < 0) return undefined;
    return arr.splice(targetIndex, 1)[0];
  };
}