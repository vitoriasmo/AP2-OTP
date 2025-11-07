import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert
} from 'react-native';
import emailjs from 'emailjs-com';

// ⚙️ CONFIGURAÇÕES DO EMAILJS
const SERVICE_ID = "service_kvp9c2f";
const TEMPLATE_ID = "template_fwf6dtm";
const PUBLIC_KEY = "kRd4CB8dHOgKI9dJj";

const LoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [otpCode, setOtpCode] = useState('');
    const [telaAtiva, setTelaAtiva] = useState('login');
    const [codigoGerado, setCodigoGerado] = useState('');

    const gerarOTP = () => {
        const novoCodigo = Math.floor(100000 + Math.random() * 900000).toString();
        setCodigoGerado(novoCodigo);
        return novoCodigo;
    };

    const enviarEmailComCodigo = async (email, codigo) => {
        try {
            await emailjs.send(
                SERVICE_ID,
                TEMPLATE_ID,
                {
                    to_email: email,
                    otp_code: codigo,
                },
                PUBLIC_KEY
            );
            Alert.alert('Código enviado!', `Um código foi enviado para ${email}.`);
        } catch (error) {
            console.error("Erro ao enviar email:", error);
            Alert.alert('Erro', 'Não foi possível enviar o e-mail. Tente novamente.');
        }
    };

    const handleEnviarCodigo = async () => {
        if (!email) {
            Alert.alert('Erro', 'Por favor, digite seu e-mail.');
            return;
        }

        const codigo = gerarOTP();

        // Envia o e-mail real
        await enviarEmailComCodigo(email, codigo);

        setTelaAtiva('otp');
    };

    const handleVerificarCodigo = () => {
        if (otpCode.length !== 6) {
            Alert.alert('Erro', 'O código deve ter 6 dígitos.');
            return;
        }

        if (otpCode === codigoGerado) {
            Alert.alert('Sucesso!', 'Login realizado com sucesso!');
            navigation.replace('Home'); // 👈 Navega para a Home
        } else {
            Alert.alert('Erro', 'Código OTP inválido.');
            setOtpCode('');
        }
    };

    const renderLoginTela = () => (
        <View style={styles.container}>
            <Text style={styles.title}>Acesse sua Conta</Text>
            <Text style={styles.subtitle}>
                Informe seu e-mail para receber o código de acesso.
            </Text>

            <TextInput
                style={styles.input}
                placeholder="Seu e-mail"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
            />
            <TouchableOpacity
                style={styles.button}
                onPress={handleEnviarCodigo}
            >
                <Text style={styles.buttonText}>Receber Código OTP</Text>
            </TouchableOpacity>
        </View>
    );

    const renderOTPTela = () => (
        <View style={styles.container}>
            <Text style={styles.title}>Verificação de Código</Text>
            <Text style={styles.subtitle}>
                Digite o código de 6 dígitos enviado para: <Text style={{ fontWeight: 'bold' }}>{email}</Text>
            </Text>

            <TextInput
                style={styles.otpInput}
                placeholder="------"
                keyboardType="numeric"
                maxLength={6}
                value={otpCode}
                onChangeText={setOtpCode}
                textAlign='center'
            />

            <TouchableOpacity
                style={styles.button}
                onPress={handleVerificarCodigo}
            >
                <Text style={styles.buttonText}>Verificar e Entrar</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleEnviarCodigo()}>
                <Text style={styles.reenviarText}>Reenviar Código</Text>
            </TouchableOpacity>
        </View>
    );

    return telaAtiva === 'login' ? renderLoginTela() : renderOTPTela();
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#333',
    },
    subtitle: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
        marginBottom: 30,
    },
    input: {
        width: '100%',
        height: 50,
        backgroundColor: '#fff',
        borderRadius: 8,
        paddingHorizontal: 15,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    otpInput: {
        width: '80%',
        height: 60,
        backgroundColor: '#fff',
        borderRadius: 8,
        paddingHorizontal: 15,
        marginBottom: 20,
        borderWidth: 2,
        borderColor: '#007bff',
        fontSize: 28,
        letterSpacing: 10,
    },
    button: {
        width: '100%',
        height: 50,
        backgroundColor: '#007bff',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 20,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    reenviarText: {
        color: '#007bff',
        fontSize: 14,
        textDecorationLine: 'underline',
    },
});

export default LoginScreen;
