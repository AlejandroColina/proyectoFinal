import React, { useEffect, useState } from "react";
import { useHistory, useParams, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  getDetail,
  getDeleteDetail,
  getPefil,
  getOpiniones,
  getPreguntas,
  responderPregunta,
  getCarta,
  sendNoti,
  reportarPregunta,
  getTrabajosPagos,
  addTrabajosPagos,
} from "../Redux/actions/index";
import NavBar from "../NavBar/NavBar";
import s from "./Detail.module.css";
import { useAuth0 } from "@auth0/auth0-react";
import { PaypalCheckoutBtn } from "./PaypalCheckoutBtn";
import Swal from "sweetalert2";
import gps from "../../assets/gps.png";
import Box from "@mui/material/Box";
import Rating from "@mui/material/Rating";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import { CardActionArea, Container } from "@mui/material";
import { Helmet } from "react-helmet";
import Footer from "../Footer/Footer";
import Help from "../Help/Help";
import Comentar from "./Comentar/Comentar";
import Preguntar from "./Preguntar/Preguntar";
import { Mapa } from "./Mapa/Mapa";
import "mapbox-gl/dist/mapbox-gl.css";
import axios from "axios";
import firebase from "firebase/compat/app";
import "firebase/compat/database";
import "firebase/compat/auth";
import Notificaciones from "../Home/notificaciones/notificaciones";
import ThreeDots from "./Loading";
import ContactDetail from "./Contact/ContactDetail";

export default function Detail({ Profesions }) {
  const { isAuthenticated, user } = useAuth0();
  const { loginWithRedirect } = useAuth0();
  const { logout } = useAuth0();
  if (isAuthenticated) {
    var onlyFirst = user.name.split(" ");
  }

  const history = useHistory();
  const dispatch = useDispatch();
  const { id } = useParams();
  const MyDetail = useSelector((state) => state.detail);
  console.log(MyDetail);
  const MyPerfil = useSelector((state) => state.perfil);
  console.log(MyPerfil[0]);
  const publi = useSelector((state) => state.info);
  const opiniones = useSelector((state) => state.opiniones);
  const preguntas = useSelector((state) => state.preguntas);
  const { currentUser } = firebase.auth();
  const uid = currentUser ? currentUser.uid : null;
  let trabajosPagos = useSelector((state) => state.trabajosPagos);

  //paginado publicaciones similares
  const [page, setPage] = useState(0);
  const currentPage = publi.slice(page, page + 3);

  const handlePrev = (e) => {
    if (page > 0) setPage(page - 3);
  };
  const handleNext = (e) => {
    if (page < publi.length - 3) setPage(page + 3);
  };

  useEffect(() => {
    dispatch(getPefil(user?.email));
    dispatch(getDetail(id));
    dispatch(getOpiniones(id));
    dispatch(getPreguntas(id));
    dispatch(getCarta(id));
    dispatch(getTrabajosPagos(user?.email, id));

    return function () {
      dispatch(getDeleteDetail());
    };
  }, [id, dispatch, user?.email]);

  let { promedio } = MyDetail;

  let precio = 10;
  if (promedio === 2) precio = 15;
  if (promedio === 3) precio = 25;
  if (promedio === 4) precio = 35;
  if (promedio === 5) precio = 50;
  let price = precio;

  const product = {
    description: "Comision",
    price: price,
  };

  const [order, setOrder] = useState(false);
  if (order) {
    Swal.fire({
      title: "Perfecto!",
      text: "Has accedido a los contactos del trabajador.¡Contáctalo!",
      icon: "success",
    });
    dispatch(addTrabajosPagos(user?.email, id));
    trabajosPagos = true;
  }

  const [input, setInput] = useState({
    respuesta: "",
  });

  const handleChange = (e) => {
    setInput({
      ...input,
      [e.target.name]: e.target.value,
    });
  };

  const { longitud } = MyDetail;

  const [comento, setComento] = useState(false);
  const [open, setOpen] = useState(false);

  const teHablo = (e) => {
    axios.patch(
      `http://localhost:3001/users/add/${MyDetail.documento}?chat=${uid}_${MyDetail.documento}&name=${MyPerfil[0].nombres}`
    );
    axios.patch(
      `http://localhost:3001/users/agg/${MyPerfil[0].id}?chat=${uid}_${MyDetail.documento}&name=${MyDetail.nombres}`
    );
  };

  if (!MyDetail.nombres) {
    return (
      <>
        <NavBar />
        <Helmet>
          <title>Cargando..</title>
        </Helmet>
        <ThreeDots />
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>{`${MyDetail.nombres}`} - Finder </title>
      </Helmet>

      <NavBar />

      <div className={s.container}>
        {/* tarjeta de contacto */}

        <div className={s.sideBar}>
          <div className={s.card}>
            <div className={s.nombres}>
              <span className={s.espacio}>Hola Soy</span>
              <span className={s.nombreCard}>
                <strong>{MyDetail.nombres} </strong>!
              </span>
            </div>
            <img
              className={s.img}
              src={MyDetail.imagen}
              alt={MyDetail.nombres}
            />
            <div className={s.ciudad}>
              <img src={gps} alt="ubicacion" className={s.gps} />
              {MyDetail.ciudad},{MyDetail.pais}
            </div>
            <br />

            {/* Botones  */}
            <div className={s.containerPrice}>
              <span className={s.valor}>Servicio: ${MyDetail.precio}</span>
              {/* <span className={s.precio}>${MyDetail.precio}</span> */}
              <span className={s.valor}>Tarifa Finder: ${price}*</span>
            </div>
            <p className={s.aclaracion}>
              * El precio de la tarifa varía según la calificación.
            </p>
            {open ? (
              <div>
                {!order ? (
                  <div className={s.paypal}>
                    <PaypalCheckoutBtn product={product} setOrder={setOrder} />
                  </div>
                ) : (
                  <div>
                    <img
                      className={s.check}
                      src="https://png.pngtree.com/png-vector/20190228/ourmid/pngtree-check-mark-icon-design-template-vector-isolated-png-image_711429.jpg"
                      alt=""
                    />
                  </div>
                )}
              </div>
            ) : (
              // Contratar

              <div
                className={s.borderPrice}
                onClick={() => {
                  setOpen(true);
                }}
              >
                <span className={s.contratar}>Contratar</span>
              </div>
            )}
            <br />
          </div>
        </div>

        <div className={s.containerInfo}>
          {!longitud ? null : <Mapa MyDetail={MyDetail} />}
          <br/>
          <br/>
          <br/>
          <hr/>
          <div className={s.subtitulos}>{MyDetail.Profesions}</div>

          <div className={s.titulos}>{MyDetail.titulo}</div>
          <br/>
          <br/>
          <div className={s.multimedia} >
            {MyDetail?.multimedia
              ? MyDetail.multimedia.map((m, i) => <img key={i} src={m} alt={m} className={i > 0 ? s.multimediaImg : s.multimediaProf} />)
              : <img src={MyDetail.logoProfesion} alt={MyDetail.Profesions} className={s.multimediaImgProf} />}
          </div>
          <div className={s.contenido}>{MyDetail.descripcion}</div>


          {!order ? <p></p> : <ContactDetail MyDetail={MyDetail} />}

          <br />
          <br />
          <br />
          <br />

          <div className={s.titulos}>Tenes dudas?</div>
          <hr />
          {isAuthenticated ?
            <Preguntar user={[user.email, user.picture]} publicacion={id} profesional={[MyDetail.email, MyDetail.imagen]} /> :
            <div className={s.width} ><button className={s.btndebe} onClick={() => { loginWithRedirect() }}>INGRESA o REGISTRATE para poder consultar</button></div>}
          <div className={s.commentsBox}>
            {preguntas
              ? preguntas.map((p) => (
                <div key={p.id}>
                  <div className={s.containerComments}>
                    <div className={s.pregunta}>{p.pregunta}</div>
                    <>{/*boton para reportar */}
                      {!p.respuesta && (isAuthenticated && user.email === MyDetail.email) ?
                        <div className={s.btn} onClick={() => {
                          dispatch(reportarPregunta(p.id));
                          console.log(p)
                        }}>⛔ Reportar</div>
                        : null}
                    </>
                    <>
                      {!p.respuesta && (isAuthenticated && user.email === MyDetail.email) ? (
                        <>
                        <form
                          className={s.form}
                          onSubmit={(e) => {
                            e.preventDefault();
                            dispatch(responderPregunta(p.id, input));
                            dispatch(sendNoti(p.user[0],{user:p.user,profesional:p.profesional,PublicacionId:p.PublicacionId,input}));
                            Swal.fire({
                              text: "Tu respuesta fue enviada!",
                              icon: "succes",
                            });
                          }}
                        >
                          <textarea
                            className={s.input}
                            name="respuesta"
                            rows="6"
                            type="text"
                            onChange={(e) => handleChange(e)}
                            value={input.respuesta}
                            required
                          />
                          <input
                            type="submit"
                            value="Responder"
                            className={s.btnResponder}
                          />
                        </form>
                        </>
                      ) : (
                        <div className={s.respuesta}>
                          <div className={s.figura}></div>
                          {p.respuesta}
                        </div>
                      )}
                    </>
                  </div>
                </div>
              ))
              : null}
          </div>
          <br />
          <br />
          <br />
          <div className={s.titulos}>
            RESEÑAS
            <Box sx={{ "& > legend": { mt: 2 } }}>
              {MyDetail.promedio ? (
                <Rating size="large" value={MyDetail.promedio} readOnly />
              ) : (
                <Rating size="large" name="no-value" value={null} />
              )}
            </Box>{" "}
          </div>
          <hr />

          {order && !comento ? (
            <Comentar
              publicacion={id}
              setComento={setComento}
              profesional={[MyDetail.email, MyDetail.imagen]}
            />
          ) : null}
          <div className={s.commentsBox}>
            {opiniones
              ? opiniones.map((r) => (
                  <div className={s.containerComments} key={r.id}>
                    <div className={s.commentPersona}>
                      "{r.comentario}"
                      <Rating size="25px" value={r.puntaje} readOnly />
                    </div>
                  </div>
                ))
              : null}
          </div>
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />

          <div className={s.titulos}>Publicaciones similares</div>
          <hr />
          <br />
          <br />
          <div className={s.cardsContainer}>
            {publi && publi[0] ? (
              currentPage.map((el) => (
                <Link to={`/trabajo/${el.id}`} className={s.link}>
                  <Card className={s.cardUi} sx={{ maxWidth: 345 }} key={el.id}>
                    <CardActionArea>
                      <CardMedia
                        component="img"
                        height="140"
                        image={
                          el.Publicacions[0].multimedia
                            ? el.Publicacions[0].multimedia
                            : el.imagen
                        }
                        alt="emprendedor"
                      />
                      <CardContent>
                        <Typography gutterBottom variant="h5" component="div">
                          {el.Publicacions[0].titulo}
                        </Typography>
                        <Typography gutterBottom variant="h6" component="div">
                          ${el.Publicacions[0].precio}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {el.Publicacions[0].descripcion}
                        </Typography>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </Link>
              ))
            ) : (
              <p>NO SE ENCONTRARON</p>
            )}
            <div className={s.paginate}>
              {page > 0 ? (
                <button className={s.btnPaginate} onClick={handlePrev}>
                  ANTERIOR
                </button>
              ) : null}
              {page < publi.length - 1 ? (
                <button className={s.btnPaginate} onClick={handleNext}>
                  SIGUIENTE 
                </button>
              ) : null}
            </div>
          </div>
        </div>
      </div>
      <Footer />
      <Help />
      {isAuthenticated && <Notificaciones />}
    </>
  );
}
