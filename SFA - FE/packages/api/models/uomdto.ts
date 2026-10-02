
export interface UOMDTO {
  
    uId?: number;
  
    isArchive?: boolean;
   
    active?: boolean;
 
    creationDate?: Date;
   
    modifiedDate?: Date | null;
  
    totalRecordCount?: number;
  
    createdBy?: number;
  
    modifiedBy?: number;
  
    uomId?: string | null;
  
    shortName?: string | null;

    description?: string | null;
}
