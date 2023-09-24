from stock_fish import Stockfish
import math

# Win% = 50 + 50 * (2 / (1 + exp(-0.00368208 * centipawns)) - 1)

fen = '2kr1b1r/p1pqpppp/1pn2n2/3p4/4P1b1/2NP1P1N/PPP1B1PP/R1BQ1RK1 w - - 0 1'

stockfish = Stockfish("..\stockfish\stockfish\stockfish-windows-x86-64-avx2.exe")

if stockfish.is_fen_valid(fen):
    stockfish.set_fen_position(fen)
    top_3_moves = stockfish.get_top_moves(3)
    centipawns = stockfish.get_evaluation()['value']
    win_percentage = round(50 + 50 * (2 / (1 + math.exp(-0.00368208 * centipawns)) - 1),2)
    response = {'win_percentage': win_percentage, 'top_3_moves': top_3_moves}
    print(response)

else:
    print('Invalid FEN string')

STOCKFISH_ENGINE = Stockfish("..\stockfish\stockfish\stockfish-windows-x86-64-avx2.exe")