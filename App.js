import { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  FlatList,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';

export default function App() {
  const [pantallaActual, setPantallaActual] = useState('registro');

  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [telefono, setTelefono] = useState('');

  const [empleados, setEmpleados] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    descargarEmpleados();
  }, []);

  const descargarEmpleados = async () => {
    try {
      const respuesta = await fetch('https://randomuser.me/api/?results=5');
      const datos = await respuesta.json();

      const empleadosAdaptados = datos.results.map((usuario) => {
        return {
          id: usuario.login.uuid,
          nombre: `${usuario.name.first} ${usuario.name.last}`,
          correo: usuario.email,
          telefono: usuario.phone,
          foto: usuario.picture.large,
        };
      });

      setEmpleados(empleadosAdaptados);
      setCargando(false);
    } catch (error) {
      console.log(error);
      Alert.alert('Error', 'No se pudieron descargar los empleados');
      setCargando(false);
    }
  };

  const agregarEmpleadoManual = () => {
    if (nombre.trim() === '' || correo.trim() === '' || telefono.trim() === '') {
      Alert.alert('Error', 'Todos los campos son obligatorios');
      return;
    }

    if (!correo.includes('@') || !correo.includes('.')) {
      Alert.alert('Error', 'El correo no es válido');
      return;
    }

    if (telefono.length !== 10) {
      Alert.alert('Error', 'El teléfono debe tener 10 dígitos');
      return;
    }

    const nuevoEmpleado = {
      id: Date.now().toString(),
      nombre: nombre,
      correo: correo,
      telefono: telefono,
      foto: `https://i.pravatar.cc/150?u=${Date.now()}`,
    };

    setEmpleados([nuevoEmpleado, ...empleados]);

    Alert.alert('Éxito', 'El empleado fue registrado correctamente');

    setNombre('');
    setCorreo('');
    setTelefono('');
  };

  if (cargando) {
    return (
      <View style={styles.pantallaCentrada}>
        <ActivityIndicator size="large" color="#333" />
        <Text style={styles.textoCarga}>Cargando empleados...</Text>
      </View>
    );
  }

  if (pantallaActual === 'lista') {
    return (
      <View style={styles.contenedor}>
        <Text style={styles.tituloPrincipal}>Lista de Empleados</Text>

        <View style={styles.espaciadoBoton}>
          <Button
            title="Registrar nuevo empleado"
            onPress={() => setPantallaActual('registro')}
          />
        </View>

        <FlatList
          data={empleados}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.tarjetaUsuario}>
              <Image source={{ uri: item.foto }} style={styles.imagenPerfil} />
              <View style={styles.infoUsuario}>
                <Text style={styles.nombreUsuario}>{item.nombre}</Text>
                <Text style={styles.textoDetalle}>{item.correo}</Text>
                <Text style={styles.textoDetalle}>{item.telefono}</Text>
              </View>
            </View>
          )}
        />
      </View>
    );
  }

  return (
    <View style={styles.contenedor}>
      <Text style={styles.tituloPrincipal}>Nuevo Ingreso</Text>

      <Text style={styles.etiqueta}>Nombre</Text>
      <TextInput
        style={styles.input}
        placeholder="Nombre completo"
        value={nombre}
        onChangeText={setNombre}
      />

      <Text style={styles.etiqueta}>Correo</Text>
      <TextInput
        style={styles.input}
        placeholder="correo@ejemplo.com"
        keyboardType="email-address"
        autoCapitalize="none"
        value={correo}
        onChangeText={setCorreo}
      />

      <Text style={styles.etiqueta}>Teléfono</Text>
      <TextInput
        style={styles.input}
        placeholder="10 dígitos"
        keyboardType="numeric"
        maxLength={10}
        value={telefono}
        onChangeText={setTelefono}
      />

      <View style={styles.espaciadoBoton}>
        <Button title="Agregar Empleado" color="#2e7d32" onPress={agregarEmpleadoManual} />
      </View>

      <View style={styles.espaciadoBoton}>
        <Button title="Ver lista de empleados" color="#1565c0" onPress={() => setPantallaActual('lista')} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: '#f4f7f6',
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  pantallaCentrada: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  textoCarga: {
    marginTop: 15,
    fontSize: 16,
    color: '#555',
  },
  tituloPrincipal: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  etiqueta: {
    fontSize: 14,
    fontWeight: '600',
    color: '#444',
    marginBottom: 5,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#d1d1d1',
    borderRadius: 8,
    paddingHorizontal: 15,
    height: 45,
    marginBottom: 15,
  },
  espaciadoBoton: {
    marginBottom: 15,
  },
  tarjetaUsuario: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  imagenPerfil: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  infoUsuario: {
    flex: 1,
    justifyContent: 'center',
  },
  nombreUsuario: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
  },
  textoDetalle: {
    fontSize: 14,
    color: '#555',
    marginTop: 3,
  },
});
