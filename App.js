import { useState } from 'react';
import { StyleSheet, Text, View, FlatList, Image, TouchableOpacity, Alert, Modal } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';

export default function App() {
  const [galeria, setGaleria] = useState([]);
  const [seleccionadas, setSeleccionadas] = useState([]);
  const [fotoExpandida, setFotoExpandida] = useState(null);
  const tomarFoto = async () => {

    if(galeria.length >= 6){
      Alert.alert('Límite de fotos alcanzado', 'No puedes tomar más de 6 fotos.');
      return;
    }

    const permisos = await ImagePicker.requestCameraPermissionsAsync();
    if (permisos.status !== 'granted') {
      Alert.alert('Permiso denegado', 'No se puede acceder a la cámara.');
      return;
    }

    const resultado = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });
    
    if (!resultado.cancelled) {
      const nuevaFoto = { 
        uri: resultado.assets[0].uri, 
        id: Date.now().toString() };
      setGaleria([...galeria, nuevaFoto]);
    }
  };

  const alternarSeleccion = (idFoto) => {
    if (seleccionadas.includes(idFoto)) {
      setSeleccionadas(seleccionadas.filter(id => id !== idFoto));
    } else {
      setSeleccionadas([...seleccionadas, idFoto]);
    }
  };

  const seleccionarTodas = () => {
    if (seleccionadas.length === galeria.length){
      setSeleccionadas([]);
    }else {
      const todoslosIDS = galeria.map((foto) => foto.id)
      setSeleccionadas(todoslosIDS)
    }
  };

  const borrarSeleccionadas = () => {
    Alert.alert(
      'Confirmar eliminación',
      `¿Estás seguro de que deseas eliminar las ${seleccionadas.length} seleccionadas?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Eliminar', style: 'destructive', onPress: () => {
          const galeriaFiltrada = galeria.filter((foto) => !seleccionadas.includes(foto.id));
          setGaleria(galeriaFiltrada);
          setSeleccionadas([]);
        } }
      ]
    );
  };

  return (
    <View style={styles.contenedor}>
      <Text style={styles.titulo}>Galería de Fotos</Text>
      <Text style={styles.contadorTexto}>Fotos tomadas: {galeria.length}</Text>

      {galeria.length === 0 ? (
        <View style={styles.estadoVacio}>
          <Ionicons name="images-outline" size={60} color="#ccc" />
          <Text style={styles.textoVacio}>No hay fotos en la galería.</Text>
        </View>
      ) : (
        <FlatList
          data={galeria}
          keyExtractor={(item) => item.id}
          numColumns={2}
          style={styles.lista}
          renderItem={({ item }) => {
            const esSeleccionada = seleccionadas.includes(item.id);
            return (
              <TouchableOpacity
                style={styles.contenedorFoto}
                onPress={() => setFotoExpandida(item.uri)}
                onLongPress={() => alternarSeleccion(item.id)}
              >
                {esSeleccionada && <View style={styles.seleccionada} />}
                <Image source={{ uri: item.uri }} style={[styles.imagen, esSeleccionada && styles.imagenSeleccionada]} />
                {esSeleccionada && (
                  <View style={styles.checkOverlay}>
                    <Ionicons name="checkmark-circle" size={24} color="red" />
                  </View>
                )}
              </TouchableOpacity>
            );
          }}
        />
      )}

      <View style={styles.contenedorControlesAbajo}>
        <TouchableOpacity
          style={[styles.botonPrincipal, galeria.length >= 6 && styles.botonPrincipalDeshabilitado]}
          onPress={tomarFoto}
          disabled={galeria.length >= 6}
        >
          <Ionicons name="camera" size={24} color="#fff" />
          <Text style={styles.textoBoton}>Tomar Foto</Text>
        </TouchableOpacity>

        <View style={styles.filaSecundaria}>
          <View style={styles.mitadFila}>
            {seleccionadas.length > 0 && (
              <TouchableOpacity style={styles.botonIconoTexto} onPress={borrarSeleccionadas}>
                <Ionicons name="trash" size={24} color="red" />
                <Text style={[styles.textoBotonSecundario, { color: 'red' }]}>{`Eliminar (${seleccionadas.length})`}</Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={[styles.mitadFila, { alignItems: 'flex-end' }]}>
            {galeria.length > 0 && (
              <TouchableOpacity style={styles.botonIconoTexto} onPress={seleccionarTodas}>
                <Ionicons
                  name={seleccionadas.length === galeria.length ? 'close-circle-outline' : 'checkmark-done-circle-outline'}
                  size={20}
                  color={seleccionadas.length === galeria.length ? 'green' : 'gray'}
                />
                <Text style={[styles.textoBotonSecundario, { color: seleccionadas.length === galeria.length ? 'green' : 'gray' }]}>
                  {seleccionadas.length === galeria.length ? 'Deseleccionar Todo' : 'Seleccionar Todo'}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>

      <Modal visible={fotoExpandida !== null} transparent={true} animationType="fade">
        <View style={styles.modalFondo}>
          <TouchableOpacity style={styles.botonCerrarModal} onPress={() => setFotoExpandida(null)}>
            <Ionicons name="close-circle" size={30} color="white" />
          </TouchableOpacity>
          {fotoExpandida && <Image source={{ uri: fotoExpandida }} style={styles.imagenCompleta} resizeMode="contain" />}
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: { flex: 1, backgroundColor: '#fff', paddingTop: 40 },
  titulo: { fontSize: 20, fontWeight: 'bold', textAlign: 'center' },
  contadorTexto: { textAlign: 'center', marginBottom: 10 },
  estadoVacio: { alignItems: 'center', marginTop: 40 },
  textoVacio: { color: '#999', marginTop: 8 },
  lista: { flex: 1 },
  contenedorFoto: { flex: 1, margin: 6, aspectRatio: 1, position: 'relative' },
  imagen: { width: '100%', height: '100%', borderRadius: 8 },
  imagenSeleccionada: { opacity: 0.6 },
  seleccionada: { position: 'absolute', top: 6, left: 6, width: 20, height: 20, borderRadius: 10, backgroundColor: 'rgba(255,0,0,0.6)' },
  checkOverlay: { position: 'absolute', top: 6, right: 6 },
  contenedorControlesAbajo: { padding: 12 },
  botonPrincipal: { backgroundColor: '#007AFF', padding: 12, borderRadius: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  botonPrincipalDeshabilitado: { backgroundColor: '#999' },
  textoBoton: { color: '#fff', marginLeft: 8 },
  filaSecundaria: { flexDirection: 'row', marginTop: 10, justifyContent: 'space-between' },
  mitadFila: { flex: 1 },
  botonIconoTexto: { flexDirection: 'row', alignItems: 'center' },
  textoBotonSecundario: { marginLeft: 6 },
  modalFondo: { flex: 1, backgroundColor: 'rgba(0,0,0,0.9)', justifyContent: 'center', alignItems: 'center' },
  botonCerrarModal: { position: 'absolute', top: 40, right: 20 },
  imagenCompleta: { width: '90%', height: '80%' },
});
