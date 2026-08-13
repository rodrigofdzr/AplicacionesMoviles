import {useState, useEffect} from 'react';
import {StyleSheet, SafeAreaView, View, Text, FlatList, Image, ActivityIndicator} from 'react-native';

export default function App() {
  const [usuarios, setUsuarios] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    descargarUsuarios();
  }, []);

  const descargarUsuarios = async () => {
    try {
      const respuesta = await fetch('https://randomuser.me/api/?results=10');
      const json = await respuesta.json();

      setUsuarios(json.results);
      setCargando(false);
    } catch (error) {
      console.error('Error al descargar los usuarios:', error);
      setCargando(false);
    }
  };

  if (cargando) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.pantallaCentrada}>
          <ActivityIndicator size="large" color="#005691" />
          <Text style={styles.textoCarga}>Cargando usuarios...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.contenedor}>
        <Text style={styles.tituloPrincipal}>Directorio Global</Text>

        <FlatList
          data={usuarios}
          keyExtractor={(item) => item.email}
          renderItem={({item}) => (
            <View style={styles.tarjetaUsuario}>
              <Image
                source={{uri: item.picture.large}}
                style={styles.imagenPerfil}
              />

              <View style={styles.infoUsuario}>
                <Text style={styles.nombreUsuario}>
                  {item.name.first} {item.name.last}
                </Text>
                <Text style={styles.correoUsuario}>{item.email}</Text>
                <Text style={styles.paisUsuario}>{item.location.country}</Text>
              </View>
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  contenedor: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 10,
  },
  pantallaCentrada: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textoCarga: {
    marginTop: 10,
    fontSize: 16,
    color: '#333',
  },
  tituloPrincipal: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#005691',
  },
  tarjetaUsuario: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  imagenPerfil: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 10,
  },
  infoUsuario: {
    justifyContent: 'center',
  },
  nombreUsuario: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  correoUsuario: {
    fontSize: 14,
    color: '#666',
  },
  paisUsuario: {
    fontSize: 14,
    color: '#666',
  },
});