const InitialState = {
  trabajadores: [],
  users: [], //va a tener todos los usuarios
  detail: [],
  usersByType: [],
  empleos: [],
  empleosForm: [],
  ciudades: [],
  adminMjes: [],
  loanding: false,
  msjDetailAdmin: {},
  ubicacion: {},
<<<<<<< HEAD
  publicacionesDeUnaPersona:[],
=======
  perfil: []
>>>>>>> 1d4c64799093f3889599ae1bb76cbc1e1b780428
};

export default function rootReducer(state = InitialState, action) {
  switch (action.type) {
    case "GET_ADMIN_USERS":
      return {
        ...state,
        users: action.payload,
      };

    case "CARDS":
      return {
        ...state,
        trabajadores: action.payload,
        loanding: false,
      };

    case "DETAIL":
      return {
        ...state,
        detail: action.payload,
      };
    case "GET_DELETE":
      return {
        ...state,
        detail: [],
      };
    case "GET_EMPLEOS":
      return {
        ...state,
        empleos: action.payload,
      };

    case "GET_EMPLEOS_FORM":
      return {
        ...state,
        empleosForm: action.payload,
      };

    case "GET_CIUDADES":
      return {
        ...state,
        ciudades: action.payload,
      };

    case "USER_BY_TYPES":
      return {
        ...state,
        usersByType: action.payload,
      };

    case 'MSJ_USER_AL_ADMIN':
      return {
        ...state,
      }

    case 'GET_MSJ_ADMIN':
      return {
        ...state,
        adminMjes: action.payload
      }
    case 'LOADER':
      return {
        ...state,
        loanding: true
      }
    case 'DELETE_POST':
      return {
        ...state
      }

    case 'READ_MSJ_ADMIN':
      return {
        ...state,
        msjDetailAdmin: action.payload
      }

    case 'OPEN_MSJ_ADMIN':
      return {
        ...state,
      }

    case 'UBICACION':
      return {
        ...state,
        ubicacion: action.payload
      }
      case 'GET_PERFIL':
        return {
          ...state,
          perfil: action.payload
        }

    case 'PUBLICACIONES_USUARIO':
      return{
        ...state,
        publicacionesDeUnaPersona: action.payload
      }

    default:
      return state;
  }
}
