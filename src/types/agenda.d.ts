declare module "agenda" {
  interface JobAttributesData {
    postId?: string;
    campaignId?: string;
    themes?: any[];
    batchIndex?: number;
    totalBatches?: number;
    expectedBatches?: number;
  }
}
