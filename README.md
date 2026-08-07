# Elite PowerPlay Tracker

**Elite PowerPlay Tracker** es un plugin para **Elgato Stream Deck** que muestra en tiempo real tus **méritos de PowerPlay** leyendo directamente los archivos *Journal* de **Elite Dangerous**.

El plugin detecta automáticamente la potencia a la que perteneces, muestra su emblema y permite visualizar tanto los méritos totales como los méritos obtenidos desde el último reinicio del contador.

---

## Características

* 🚀 Lectura automática de los archivos *Journal* de Elite Dangerous.
* 🛡️ Detección automática de la potencia actual.
* 🎨 Emblema oficial de cada potencia.
* 📊 Visualización de los méritos totales.
* ➕ Contador de méritos obtenidos desde el último reinicio.
* 🌈 Colores automáticos según la potencia.
* 🎨 Posibilidad de usar colores personalizados para cada texto.
* 🔤 Tamaño de fuente configurable.
* ↔️ Desplazamiento automático del texto cuando no cabe en la tecla.
* ⚡ Velocidad de desplazamiento configurable.
* 📍 Posición vertical independiente para cada texto.
* 💾 Configuración guardada automáticamente.
* 🔄 Reinicio del contador de méritos con una pulsación.

---

## Potencias compatibles

* Aisling Duval
* Archon Delaine
* Arissa Lavigny-Duval
* Denton Patreus
* Edmund Mahon
* Felicia Winters
* Jerome Archer
* Li Yong-Rui
* Nakato Kaine
* Pranav Antal
* Yuri Grom
* Zemina Torval

---

## Requisitos

* Windows
* Elite Dangerous
* Elgato Stream Deck
* Stream Deck Software

El plugin lee automáticamente los archivos *Journal* ubicados en:

```text
C:\Users\<usuario>\Saved Games\Frontier Developments\Elite Dangerous
```

---

## Instalación

1. Descarga la última versión desde la sección **Releases**.
2. Abre el archivo `.streamDeckPlugin`.
3. Stream Deck instalará el plugin automáticamente.
4. Arrastra la acción **PowerPlay Tracker** a cualquier tecla.

---

## Configuración

Cada tecla puede configurarse de forma independiente.

Opciones disponibles:

* Tamaño del texto de méritos totales.
* Tamaño del texto de méritos obtenidos.
* Velocidad de desplazamiento de ambos textos.
* Posición vertical de cada texto.
* Uso automático del color de la potencia.
* Color personalizado para cada texto.

---

## Funcionamiento

El plugin monitoriza continuamente el último archivo *Journal* generado por Elite Dangerous.

Cada vez que el juego actualiza los méritos de PowerPlay, la tecla se actualiza automáticamente mostrando:

* El emblema de la potencia actual.
* Los méritos totales.
* Los méritos obtenidos desde el último reinicio.

Al pulsar la tecla del Stream Deck se reinicia el contador de méritos obtenidos, tomando el total actual como nueva referencia.

---

## Hoja de ruta

Algunas mejoras previstas para futuras versiones:

* 🔊 Sonidos al ganar méritos.
* 📈 Nuevas acciones relacionadas con PowerPlay.
* 🛠️ Herramientas adicionales para Elite Dangerous.
* 🎨 Más opciones de personalización.
* 🌍 Traducción a varios idiomas.

---

## Licencia

Este proyecto se distribuye bajo la licencia **MIT**.

Elite Dangerous es una marca registrada de **Frontier Developments plc**.

Este proyecto es una herramienta creada por la comunidad y no está afiliado ni respaldado oficialmente por Frontier Developments.
