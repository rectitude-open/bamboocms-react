export interface FormPageProps {
  schema: any;
  uiSchema: any;
  services: {
    initService?: (data: any) => Promise<any>;
    submitService?: (data: any, params?: any) => Promise<any>;
  };
  requiredParams?: string[];
  pageTitle?: string;
}
