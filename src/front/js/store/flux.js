const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			message: null,
			userData: null,
			message: null,
			demo: [
				{
					title: "FIRST",
					background: "white",
					initial: "white"
				},
				{
					title: "SECOND",
					background: "white",
					initial: "white"
				}
			]
		},
		actions: {
			// Use getActions to call a function within a fuction
			exampleFunction: () => {
				getActions().changeColor(0, "green");
			},

			login: async (email, password) => {
				try {
					const response = await fetch('https://cuddly-telegram-qwj9j6jxj49c6xjp-3001.app.github.dev/api/login', {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json'
						},
						body: JSON.stringify({ email, password })
					});
					if (response.ok) {
						const data = await response.json();
						localStorage.setItem('token', data.token)
						return true;
					} else {
						console.error("Login incorrecto");
						return false;
					}

				} catch (error) {
					console.error("Error en el login", error)
					return false;
				}
			},

			register: async (email, password) => {
                try {
                    const response = await fetch('https://cuddly-telegram-qwj9j6jxj49c6xjp-3001.app.github.dev/api/user', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ email, password })
                    });

                    const data = await response.json();
                    if (response.ok) {
                        setStore({ message: "Usuario registrado correctamente" });

                        // Redirigir a la página de login después de 2 segundos
                        setTimeout(() => {
                            setStore({ message: null }); // Limpia el mensaje después de 2 segundos
                            // Redirigir usando el hook useNavigate en el componente
                            getActions().navigate('/login'); 
                        }, 2000);

                        return true;
                    } else {
                        setStore({ message: `Error al registrar usuario: ${data.msg}` });
                        return false;
                    }
                } catch (error) {
                    console.error("Error al registrar", error);
                    setStore({ message: "Error al registrar usuario" });
                    return false;
                }
            },

			profile: async (email, password) => {
				const store = getStore();
				const token = localStorage.getItem('token');
				console.log(token);
				if (!token) {
					console.error("No token found");
					return false;
				}

				try {
					const response = await fetch('https://cuddly-telegram-qwj9j6jxj49c6xjp-3001.app.github.dev/api/user', {
						method: 'GET',
						headers: {
							'Content-Type': 'application/json',
							'Authorization': `Bearer ${token}`
						},
					});

					if (response.ok) {
						const data = await response.json();

						console.log("Profile data", data)
						
						setStore({ userData: data.results });
						return true;
					} else {
						const errorData = await response.json();
						console.error("Error fetching profile:", errorData.message || response.statusText);
						return false;
					}
				} catch (error) {
					console.error("Error al intentar traer el perfil", error);
					return false;
				}
			},

			getMessage: async () => {
				try {
					// fetching data from the backend
					const resp = await fetch(process.env.BACKEND_URL + "/api/hello")
					const data = await resp.json()
					setStore({ message: data.message })
					// don't forget to return something, that is how the async resolves
					return data;
				} catch (error) {
					console.log("Error loading message from backend", error)
				}
			},
			changeColor: (index, color) => {
				//get the store
				const store = getStore();

				//we have to loop the entire demo array to look for the respective index
				//and change its color
				const demo = store.demo.map((elm, i) => {
					if (i === index) elm.background = color;
					return elm;
				});

				//reset the global store
				setStore({ demo: demo });
			}
		}
	};
};

export default getState;
