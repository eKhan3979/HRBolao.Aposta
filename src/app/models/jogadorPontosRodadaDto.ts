export interface JogadorPontosRodadaDto {
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
    GolsCasaAposta: number;
    GolsVisitanteAposta: number;
    Pontos: number;
    EscudoCasa: string;
    EscudoVisitante: string;
};