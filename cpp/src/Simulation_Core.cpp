#include <cstdint>
#include <emscripten.h>
#include <mdspan>

//------------------------------------------------------------------------------------------------------------

// Global World Dimensions
const int32_t WIDTH = 128;
const int32_t HEIGHT = 128;
const int32_t GRID_SIZE = WIDTH * HEIGHT;

// Plain C-style static array. It is pre-allocated in the WASM data segment,
// completely bypassing the need for runtime C++ constructor execution in
// --no-entry mode.
int32_t g_tile_types[GRID_SIZE];
uint32_t g_random_seed = 123456789u; // Seed for custom random generator
//------------------------------------------------------------------------------------------------------------

// Custom standalone LCG Pseudo-Random Number Generator.
// Fully deterministic, runs in 1 CPU cycle, and has zero dependencies on OS
// files (100% crash-proof).
inline uint32_t Lcg_Random() {
  g_random_seed = g_random_seed * 1664525u + 1013904223u;
  return g_random_seed;
}
//------------------------------------------------------------------------------------------------------------

extern "C" {
EMSCRIPTEN_KEEPALIVE void Generate_Random_Map() {
  int32_t x = 0;
  int32_t y = 0;
  uint32_t roll = 0;

  // 1.0. Create a 2D view over our flat 1D static array using C++26 mdspan
  auto tile_view = std::mdspan(g_tile_types, HEIGHT, WIDTH);

  // 1.1. Iterate over the 2D grid to set tile values
  for (y = 0; y < HEIGHT; ++y) {
    for (x = 0; x < WIDTH; ++x) {
      // 1.2. Roll a pseudo-random value between 1 and 100
      roll = (Lcg_Random() % 100) + 1;

      if (roll <= 80) {
        tile_view[y, x] = 1; // 80% Solid Earth
      } else if (roll <= 92) {
        tile_view[y, x] = 2; // 12% Plumbing Pipes
      } else {
        tile_view[y, x] = 3; // 8% Electrical Wires
      }
    }
  }
}
//------------------------------------------------------------------------------------------------------------
EMSCRIPTEN_KEEPALIVE int32_t *Get_Tile_Types_Ptr() { return g_tile_types; }
}