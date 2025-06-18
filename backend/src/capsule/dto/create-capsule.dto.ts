export class CreateCapsuleDto {
  titulo: string;
  conteudo: string;
  dataAbertura: Date;
  categoria: 'pessoal' | 'familia' | 'trabalho' | 'meta' | 'viagem';
  imagem?: string;
  audio?: string;
}
