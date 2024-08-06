const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
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
			],
			posts: [] // Inicializar posts como un array vacío
		},
		actions: {
			// Use getActions to call a function within a fuction
			exampleFunction: () => {
				getActions().changeColor(0, "green");
			},

			getMessage: async () => {
				try{
					// fetching data from the backend
					const resp = await fetch(process.env.BACKEND_URL + "/api/hello")
					const data = await resp.json()
					setStore({ message: data.message })
					// don't forget to return something, that is how the async resolves
					return data;
				}catch(error){
					console.log("Error loading message from backend", error)
				}
			},

			login: async (username, password) => {
				const response = await fetch(`${process.env.BACKEND_URL}/login`, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({ username, password })
				});
				const data = await response.json();
				if (response.ok) {
					localStorage.setItem('token', data.token);
					setStore({ isAuthenticated: true, token: data.token });
					return true;
				} else {
					console.log(data.msg);
					return false;
				}
			},

			register: async (avatar, name, surname, username, password) => {
				const response = await fetch(`${process.env.BACKEND_URL}/register`, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({ avatar, name, surname, username, password })
				});
				const data = await response.json();
				if (!response.ok) {
					console.log(data.msg);
				} else {
					alert('Usuario registrado exitosamente');
					const navigate = getActions().navigate;
					if (navigate) navigate('/login');
				}
			},

			setNavigate: (navigateFunc) => {
				setStore({ navigate: navigateFunc });
			},

			fetchPosts: async () => {
				try {
					const response = await fetch(`${process.env.BACKEND_URL}/posts`);
					const data = await response.json();
					setStore({ posts: data });
				} catch (error) {
					console.log("Error fetching posts", error);
				}
			},

            createPost: async (postData) => {
				try {
					const response = await fetch(`${process.env.BACKEND_URL}/posts`, {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json'
						},
						body: JSON.stringify(postData)
					});
					const data = await response.json();
					getActions().fetchPosts();  // Para actualizar la lista de publicaciones
					return data;
				} catch (error) {
					console.log("Error creating post", error);
				}
			},

            likePost: async (postId) => {
				try {
					const response = await fetch(`${process.env.BACKEND_URL}/posts/${postId}/like`, {
						method: 'POST'
					});
					const data = await response.json();
					getActions().fetchPosts();  // Para actualizar la lista de publicaciones
					return data;
				} catch (error) {
					console.log("Error liking post", error);
				}
			}
		}
	};
};

export default getState;
