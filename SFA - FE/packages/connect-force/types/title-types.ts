export interface Title {
  /**
   * @type {string}
   * @memberof Title
   */
  uId?: number;
  isArchive: boolean;
  active: boolean;
  description?: string | null;
  createdBy: string;
  creationDate: string;
  modifiedBy: string;
  modifiedDate: string;
}
export type TitleFormValuesProps = {
  description?: string | null;
};
