# Benchmark di bilanciamento — ultimo run

**Data:** 2026-07-02T12:09:18.081Z · **Commit:** 7936c91 (working tree sporco) · **KB:** v1.42
**Campione:** 250 partite (seed 1-250) · **Scoring:** presa 1, scopa 3 (v1.32)
**Policy mercato:** greedy: 1 figura per mercato per lato, la piu costosa acquistabile non ancora posseduta (Re>Regina>Fante)

> Confronto (Δ) rispetto al run precedente: commit 739574f, KB v1.41, 2026-07-02T06:52:39.873Z (stesso N=250).

## A) Esito della partita

- **Vittorie della missione:** Protagonisti **55.60%** (+1.2) · Opposizione **44.40%** (-1.2)
- **Crescita per scaglione (P):** 0-2 6.40% (+0.8) · 3-6 50.40% (+0.8) · 7+ 43.20% (-1.6)
- **Crescita per scaglione (O):** 0-2 10.80% (+0.4) · 3-6 60.40% (+1.2) · 7+ 28.80% (-1.6)
- **Ribaltoni dopo i colpi di scena:** pro-Protagonisti 26.80% (-0.4) · pro-Opposizione 25.20% (-1.2)

## B.1) Punti guadagnati (lordi) per scena

| Scena | Protagonisti | Opposizione |
|---|---|---|
| 1 | 2.35 (+0) | 2.19 (+0) |
| 2 | 2.78 (+0) | 2.86 (+0) |
| 3 | 2.56 (+0) | 3.23 (+0) |
| 4 | 2.74 (+0) | 3.04 (+0) |
| 5 | 3.24 (-0.14) | 2.25 (-0.06) |
| **Totale** | **13.67** (-0.14) | **13.58** (-0.06) |

A fine partita — **netti** (Crescita): P 6.29 · O 5.34 · **spesi** al mercato: P 7.38 · O 8.24

## B.2) Figure possedute (cumulative) a fine scena

*Spesa "quantizzata": ogni figura è un blocco di punti (Fante 3, Regina 5, Re 8).*

| Scena | Protagonisti | Opposizione |
|---|---|---|
| 1 | 0.46 (+0) | 0.44 (+0) |
| 2 | 0.95 (+0) | 0.94 (+0) |
| 3 | 1.38 (+0) | 1.52 (+0) |
| 4 | 1.78 (+0) | 1.92 (+0) |
| 5 | 1.78 (+0) | 1.92 (+0) |

## C) Scene

**Vittoria per singola scena (% partite):**

| Scena | Protagonisti | Opposizione |
|---|---|---|
| 1 | 72.00% | 28.00% |
| 2 | 61.60% | 38.40% |
| 3 | 53.20% | 46.80% |
| 4 | 58.80% | 41.20% |
| 5 | 54.00% | 46.00% |

Poste medie vinte: P **3.00** · O **2.00**

**Rapporto scene vinte per partita (P-O su 5):**

- 5-0: 10.80% (+0)
- 4-1: 21.20% (-1.2)
- 3-2: 34.00% (+2)
- 2-3: 25.60% (-0.4)
- 1-4: 7.60% (+0)
- 0-5: 0.80% (-0.4)

## D) Meccaniche

- **Figure comprate/partita:** P 1.78 · O 1.92
  - distribuzione P (0/1/2/3): 3.20% / 28.40% / 55.20% / 13.20%
  - distribuzione O (0/1/2/3): 2.00% / 22.80% / 56.00% / 19.20%
- **Scope/partita:** P 2.89 · O 3.11
- **Rese/partita:** 0.92 · **Jolly usati/partita:** 0.75 (cattura P 0.38 · cattura O 0.37)
