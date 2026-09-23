# Benchmark di bilanciamento — ultimo run

**Data:** 2026-09-23T18:49:33.789Z · **Commit:** c0afac7 (working tree sporco) · **KB:** v1.46
**Campione:** 250 partite (seed 1-250) · **Scoring:** presa 1, scopa 3 (v1.32)
**Policy mercato:** greedy: 1 figura per mercato per lato, la piu costosa acquistabile non ancora posseduta (Re>Regina>Fante)

> Confronto (Δ) rispetto al run precedente: commit 3e3e550, KB v1.45, 2026-07-08T10:26:54.307Z (stesso N=250).

## A) Esito della partita

- **Vittorie della missione:** Protagonisti **54.40%** (+0) · Opposizione **45.60%** (+0)
- **Crescita per scaglione (P):** 0-2 5.20% (+0) · 3-6 45.60% (+2) · 7+ 49.20% (-2)
- **Crescita per scaglione (O):** 0-2 8.00% (-0.4) · 3-6 61.60% (+0.4) · 7+ 30.40% (+0)
- **Ribaltoni dopo i colpi di scena:** pro-Protagonisti 25.20% (-0.8) · pro-Opposizione 22.00% (-0.8)

## B.1) Punti guadagnati (lordi) per scena

| Scena | Protagonisti | Opposizione |
|---|---|---|
| 1 | 2.35 (+0) | 2.19 (+0) |
| 2 | 2.62 (+0) | 2.88 (-0.02) |
| 3 | 2.59 (+0) | 2.99 (-0.01) |
| 4 | 2.77 (-0.06) | 2.94 (-0.01) |
| 5 | 3.31 (-0.05) | 2.33 (+0.03) |
| **Totale** | **13.65** (-0.11) | **13.34** (-0.01) |

A fine partita — **netti** (Crescita): P 6.51 · O 5.58 · **spesi** al mercato: P 7.14 · O 7.76

## B.2) Figure possedute (cumulative) a fine scena

*Spesa "quantizzata": ogni figura è un blocco di punti (Fante 3, Regina 6, Re 9).*

| Scena | Protagonisti | Opposizione |
|---|---|---|
| 1 | 0.46 (+0) | 0.44 (+0) |
| 2 | 0.88 (+0) | 0.90 (+0) |
| 3 | 1.30 (+0) | 1.36 (-0.01) |
| 4 | 1.64 (+0) | 1.74 (+0) |
| 5 | 1.64 (+0) | 1.74 (+0) |

## C) Scene

**Vittoria per singola scena (% partite):**

| Scena | Protagonisti | Opposizione |
|---|---|---|
| 1 | 71.60% | 28.40% |
| 2 | 59.60% | 40.40% |
| 3 | 57.60% | 42.40% |
| 4 | 48.80% | 51.20% |
| 5 | 51.20% | 48.80% |

Poste medie vinte: P **2.89** · O **2.11**

**Rapporto scene vinte per partita (P-O su 5):**

- 5-0: 7.60% (-0.4)
- 4-1: 22.80% (+0.8)
- 3-2: 32.00% (+0)
- 2-3: 27.20% (+0.4)
- 1-4: 9.20% (-0.8)
- 0-5: 1.20% (+0)

## D) Meccaniche

- **Figure comprate/partita:** P 1.64 · O 1.74
  - distribuzione P (0/1/2/3): 1.60% / 41.20% / 48.80% / 8.40%
  - distribuzione O (0/1/2/3): 2.40% / 29.60% / 59.60% / 8.40%
- **Scope/partita:** P 2.76 · O 3.00
- **Rese/partita:** 0.91 · **Jolly usati/partita:** 0.80 (cattura P 0.41 · cattura O 0.40)
