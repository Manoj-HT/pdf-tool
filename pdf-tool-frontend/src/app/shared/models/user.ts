import { PDF } from "./pdf";

export type User = {
    id : string;
    email: string;
    password : string;
    pdfList : PDF[];
    name  : string;
}