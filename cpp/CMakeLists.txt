#-------------------------------------------------------------------------------------------------------------
cmake_minimum_required(VERSION 3.20)
# Force Emscripten toolchain to bypass any VS Code kit caching conflicts
set(CMAKE_TOOLCHAIN_FILE "/home/get_boros/emsdk/upstream/emscripten/cmake/Modules/Platform/Emscripten.cmake" CACHE PATH "Emscripten Toolchain File" FORCE)
#-------------------------------------------------------------------------------------------------------------
project(Core_Simulation CXX)

set(CMAKE_CXX_STANDARD 26)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_EXPORT_COMPILE_COMMANDS ON)  # Enable clangd database generation
#-------------------------------------------------------------------------------------------------------------
set(SOURCES src/Simulation_Core.cpp)  # Source files (using your updated filename)
#-------------------------------------------------------------------------------------------------------------
add_executable(Simulation_Core ${SOURCES})
#-------------------------------------------------------------------------------------------------------------
# Emscripten specific linker configuration with UPDATED exported functions list
target_link_options(Simulation_Core PRIVATE
  "-O3"
  "--no-entry"
  "-sEXPORTED_FUNCTIONS=['_Generate_Random_Map','_Get_Tile_Types_Ptr','_malloc','_free']"
  "-sERROR_ON_UNDEFINED_SYMBOLS=0"
)

set_target_properties(Simulation_Core PROPERTIES  # Tell compiler to output pure wasm file
  OUTPUT_NAME "simulation"
  SUFFIX ".wasm"
)
#-------------------------------------------------------------------------------------------------------------
set(VITE_PUBLIC_DIR "${CMAKE_CURRENT_SOURCE_DIR}/../public")  # Target directory: Vite public assets

# Post-build step to automatically copy the binary to Vite public directory
add_custom_command(TARGET Simulation_Core POST_BUILD
  COMMAND ${CMAKE_COMMAND} -E make_directory "${VITE_PUBLIC_DIR}"
  COMMAND ${CMAKE_COMMAND} -E copy_if_different
          $<TARGET_FILE:Simulation_Core>
          "${VITE_PUBLIC_DIR}/simulation.wasm"
  COMMENT "Copying compiled WASM directly to Vite public assets"
)
#-------------------------------------------------------------------------------------------------------------
