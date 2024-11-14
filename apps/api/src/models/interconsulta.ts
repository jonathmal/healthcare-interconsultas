// apps/api/src/models/Interconsulta.ts
import { type Interconsulta as IInterconsulta } from "/Users/jonathanjethmal/Desktop/sistema-interconsultas/healthcare-interconsultas/packages/shared/src/types/interconsulta.ts";
import mongoose from 'mongoose';

const interconsultaSchema = new mongoose.Schema<IInterconsulta>({...});

export const Interconsulta = mongoose.model<IInterconsulta>('Interconsulta', interconsultaSchema);