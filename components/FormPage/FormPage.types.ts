export interface FormPageProps {
  schema: any;
  uiSchema: any;
  services: {
    initService?: (data: any) => Promise<any>;
    submitService?: (data: any) => Promise<any>;
  };
  requiredParams?: string[];
}
