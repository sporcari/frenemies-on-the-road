# Benchmark di bilanciamento — ultimo run

**Data:** 2026-07-08T10:26:54.307Z · **Commit:** 3e3e550 (working tree sporco) · **KB:** v1.45
**Campione:** 250 partite (seed 1-250) · **Scoring:** presa 1, scopa 3 (v1.32)
**Policy mercato:** greedy: 1 figura per mercato per lato, la piu costosa acquistabile non ancora posseduta (Re>Regina>Fante)

> Confronto (Δ) rispetto al run precedente: commit 3e3e550, KB v1.44, 2026-07-07T19:14:19.067Z (stesso N=250).

## A) Esito della partita

- **Vittorie della missione:** Protagonisti **54.40%** (-1.2) · Opposizione **45.60%** (+1.2)
- **Crescita per scaglione (P):** 0-2 5.20% (-2.4) · 3-6 43.60% (-2) · 7+ 51.20% (+4.4)
- **Crescita per scaglione (O):** 0-2 8.40% (+1.2) · 3-6 61.20% (+3.2) · 7+ 30.40% (-4.4)
- **Ribaltoni dopo i colpi di scena:** pro-Protagonisti 26.00% (-1.6) · pro-Opposizione 22.80% (+1.2)

## B.1) Punti guadagnati (lordi) per scena

| Scena | Protagonisti | Opposizione |
|---|---|---|
| 1 | 2.35 (+0) | 2.19 (+0) |
| 2 | 2.62 (+0) | 2.90 (+0) |
| 3 | 2.59 (+0.03) | 3.00 (-0.1) |
| 4 | 2.83 (+0) | 2.95 (-0.13) |
| 5 | 3.36 (-0.09) | 2.30 (-0.07) |
| **Totale** | **13.76** (-0.06) | **13.35** (-0.29) |

A fine partita — **netti** (Crescita): P 6.58 · O 5.56 · **spesi** al mercato: P 7.18 · O 7.79

## B.2) Figure possedute (cumulative) a fine scena

*Spesa "quantizzata": ogni figura è un blocco di punti (Fante 3, Regina 6, Re 9).*

| Scena | Protagonisti | Opposizione |
|---|---|---|
| 1 | 0.46 (+0) | 0.44 (+0) |
| 2 | 0.88 (-0.05) | 0.90 (-0.06) |
| 3 | 1.30 (-0.09) | 1.37 (-0.11) |
| 4 | 1.64 (-0.16) | 1.74 (-0.15) |
| 5 | 1.64 (-0.16) | 1.74 (-0.15) |

## C) Scene

**Vittoria per singola scena (% partite):**

| Scena | Protagonisti | Opposizione |
|---|---|---|
| 1 | 72.00% | 28.00% |
| 2 | 60.00% | 40.00% |
| 3 | 58.40% | 41.60% |
| 4 | 46.00% | 54.00% |
| 5 | 51.20% | 48.80% |

Poste medie vinte: P **2.88** · O **2.12**

**Rapporto scene vinte per partita (P-O su 5):**

- 5-0: 8.00% (+0.4)
- 4-1: 22.00% (+0.8)
- 3-2: 32.00% (-4.8)
- 2-3: 26.80% (+2)
- 1-4: 10.00% (+2)
- 0-5: 1.20% (-0.4)

## D) Meccaniche

- **Figure comprate/partita:** P 1.64 · O 1.74
  - distribuzione P (0/1/2/3): 1.60% / 41.20% / 48.40% / 8.80%
  - distribuzione O (0/1/2/3): 2.40% / 30.40% / 58.00% / 9.20%
- **Scope/partita:** P 2.78 · O 3.02
- **Rese/partita:** 0.95 · **Jolly usati/partita:** 0.81 (cattura P 0.41 · cattura O 0.40)
