# Benchmark di bilanciamento — ultimo run

**Data:** 2026-07-01T16:41:52.973Z · **Commit:** 12f107b (working tree sporco) · **KB:** v1.36
**Campione:** 250 partite (seed 1-250) · **Scoring:** presa 1, scopa 3 (v1.32)
**Policy mercato:** greedy: 1 figura per mercato per lato, la piu costosa acquistabile non ancora posseduta (Re>Regina>Fante)

> Confronto (Δ) rispetto al run precedente: commit e5c621f, KB v1.35, 2026-07-01T16:27:43.611Z (stesso N=250).

## A) Esito della partita

- **Vittorie della missione:** Protagonisti **57.20%** (+6) · Opposizione **42.80%** (-6)
- **Esiti:** VITTORIA PIENA 38.00% (+4.8) · PER IL ROTTO DELLA CUFFIA 19.20% (+1.2) · SCONFITTA DIGNITOSA 26.80% (-2) · FALLIMENTO TOTALE 16.00% (-4)
- **Ribaltoni dopo i colpi di scena:** pro-Protagonisti 18.80% (-2.8) · pro-Opposizione 14.00% (-0.4)

## B.1) Punti guadagnati (lordi) per scena

| Scena | Protagonisti | Opposizione |
|---|---|---|
| 1 | 2.34 (+0) | 2.19 (+0) |
| 2 | 3.22 (-0.03) | 3.36 (+0.04) |
| 3 | 3.79 (+0.1) | 3.44 (-0.01) |
| 4 | 4.40 (-0.02) | 3.46 (+0.02) |
| 5 | 4.81 (-0.13) | 2.52 (+0.03) |
| **Totale** | **18.57** (-0.07) | **14.98** (+0.08) |

A fine partita — **netti** (Crescita): P 7.33 · O 5.72 · **spesi** al mercato: P 11.24 · O 9.26

## B.2) Figure possedute (cumulative) a fine scena

*Spesa "quantizzata": ogni figura è un blocco di punti (Fante 3, Regina 5, Re 8).*

| Scena | Protagonisti | Opposizione |
|---|---|---|
| 1 | 0.46 (+0) | 0.44 (+0) |
| 2 | 1.01 (+0) | 1.01 (+0.01) |
| 3 | 1.69 (+0.05) | 1.58 (+0.02) |
| 4 | 2.37 (+0.02) | 2.01 (+0.05) |
| 5 | 2.37 (+0.02) | 2.01 (+0.05) |

## C) Scene

**Vittoria per singola scena (% partite):**

| Scena | Protagonisti | Opposizione |
|---|---|---|
| 1 | 73.20% | 26.80% |
| 2 | 52.80% | 47.20% |
| 3 | 45.60% | 54.40% |
| 4 | 41.60% | 58.40% |
| 5 | 57.20% | 42.80% |

Poste medie vinte: P **2.70** · O **2.30**

**Rapporto scene vinte per partita (P-O su 5):**

- 5-0: 5.60% (+1.6)
- 4-1: 18.80% (+1.6)
- 3-2: 32.80% (+0)
- 2-3: 28.40% (-4)
- 1-4: 12.00% (+0.8)
- 0-5: 2.40% (+0)

## D) Meccaniche

- **Figure comprate/partita:** P 2.37 · O 2.01
  - distribuzione P (0/1/2/3): 3.20% / 10.80% / 44.80% / 28.40%
  - distribuzione O (0/1/2/3): 3.20% / 16.00% / 57.60% / 23.20%
- **Scope/partita:** P 3.20 · O 3.36
- **Rese/partita:** 0.94 · **Jolly usati/partita:** 0.25 (cattura P 0.23 · spinta O 0.02)
