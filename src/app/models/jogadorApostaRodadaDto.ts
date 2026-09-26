export interface JogadorApostaRodadaDto {
    IdCampeonatoJogo: number;
	Dd_Mm_Yyyy: string;
    Hh_Mm: string;
    IdTimeCasa: number;
    TimeCasa: string;
    GolsTimeCasa: number;
    IdTimeVisitante: number;
    TimeVisitante: string;
    GolsTimeVisitante: number;
    Finalizado: boolean;
    IdAposta: number;
    GolsApostaTimeCasa: number;
    GolsApostaTimeVisitante: number;
    Editavel: boolean;
    Pontos: number;
    EscudoCasa: string;
    EscudoVisitante: string;
};