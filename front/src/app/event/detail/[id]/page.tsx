"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import Link from "next/link";
import { userAuthStore } from "@/store/userAuthStore";
import { useFetchHook } from "@/hooks/useFetchHook";

interface Params {
    id: string;
}

export default function App({ params }: { params: Params }) {
    const user = userAuthStore((state) => state.user);
    console.log(user);

    const { id } = params;

    const [datosCargados, setDatosCargados] = useState(false);
    const [getItem, setGetItem] = useState({
        id: "",
        name: "",
        about: "",
        date: "",
        location: "",
        price: "",
        event_poster_url: "",
        celebrity_id: "",
        avatar_url: "",
        uuid: ""
    });
    const getUseFetch = useFetchHook()
    //Carga de datos
    const getTask = async () => {
        const data = await getUseFetch({
            endpoint: `events/${params.id}`,
            method: 'get'
        });

        console.log(data);

        setGetItem({
            id: data.data.id,
            name: data.data.name,
            about: data.data.about,
            date: data.data.date,
            location: data.data.location,
            price: data.data.price,
            event_poster_url: data.data.event_poster_url, // data.data.event_poster_url || null,
            celebrity_id: "1",
            avatar_url: data.data.celebrities.users.avatar_url,
            uuid: data.data.uuid
        });
        setDatosCargados(true);
    }
    useEffect(() => {
        if (id) {
            getTask();
        }
    }, []);
    //Split de la ubicación
    let location = getItem.location.split('/');
    const nameLocation = location[0];
    const Lat = parseFloat(location[1]);
    const lng = parseFloat(location[2]);
    //conversion de la fecha
    const date = getItem.date.substring(0, 10);

    const foundBlog = getItem.uuid === params.id;
    if (!foundBlog && !datosCargados) {
        return (
            <section className="flex flex-col justify-center items-center h-screen w-full mt-14 px-2">
                <h1
                    className={
                        "animate-pulse text-6xl font-bold bg-gradient-to-br from-zinc-600 via-zinc-400 to-zinc-700 bg-clip-text text-transparent"
                    }
                >
                    Cargando...
                </h1>
            </section>
        );
    }
    if (!foundBlog) {
        return (
            <section className="flex flex-col justify-center items-center h-screen w-full mt-14 px-2">
                <h1
                    className={
                        "text-6xl font-bold bg-gradient-to-br from-zinc-600 via-zinc-400 to-zinc-700 bg-clip-text text-transparent"
                    }
                >
                    ERROR 404
                </h1>
                <h2 className=" py-8 text-xl font-semibold text-center text-zinc-400">
                    Evento no encontrado, vuelve a menu o intenta recargar la página.
                </h2>
                <Image
                    src="/cart/qrnofound.webp"
                    alt="qr no encontrado"
                    width={200}
                    height={200}
                    className="drop-shadow-[0_0px_20px_rgba(0,0,0,0.75)]"
                />
            </section>
        );
    }

    return (
        <section className="flex flex-col pb-10">
            <figure className="relative flex justify-center items-center w-full h-72 shadow-md">
                <div className="absolute flex justify-between px-4 w-full top-2 z-30">
                    <Link className="rounded-lg px-4 py-2" href="/">
                        <svg className="stroke-zinc-600" xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22" fill="none">
                            <path d="M14.0938 4.8125L7.90625 11L14.0938 17.1875" strokeOpacity="0.7" strokeWidth="2.0625" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </Link>
                    <Link className="rounded-lg px-4 py-2" href="#">
                        <svg className="stroke-zinc-600" xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22" fill="none">
                            <path d="M11.0002 4.58341V12.3751M13.7502 6.41675L11.0002 3.66675L8.25016 6.41675M4.5835 11.0001V15.5834C4.5835 16.0696 4.77665 16.536 5.12047 16.8798C5.46428 17.2236 5.9306 17.4167 6.41683 17.4167H15.5835C16.0697 17.4167 16.536 17.2236 16.8799 16.8798C17.2237 16.536 17.4168 16.0696 17.4168 15.5834V11.0001" strokeOpacity="0.7" strokeWidth="1.83333" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </Link>
                </div>
                <Image className="object-cover w-full h-72" src={getItem.event_poster_url} alt="Imagen de cabecera" width={400} height={400} />
            </figure>
            <div className="flex justify-center items-center gap-8">
                <figure className="w-28">
                    <Image
                        className="absolute w-[75xp] h-[75px] top-64 left-8 rounded-full border-[4px] border-white z-20"
                        src={user ? user.avatar_url : '/Ellipse4.png'}
                        alt="User image"
                        height={75}
                        width={75}
                    />
                </figure>
                <div className="w-full pt-[11px] pb-[6px] px-3 text-left z-20">
                    <p className="text-xs font-new font-bold">{date}</p>
                    <h1 className="text-4xl font-new font-extrabold">{getItem.name}</h1>
                </div>
            </div>
            {user && <Link href={`/event/edit/${getItem.uuid}`} className="mx-auto rounded-[30px] bg-[#030712] h-12 w-1/2 py-2 text-white font-new text-lg text-center font-medium">Editar</Link>}
            <div className="px-8 pt-4">
                <h2 className="text-xl font-new pb-[11px] pl-[9px]">Acerca del evento</h2>
                <div className="rounded-3xl bg-[#D9D9D9] p-[18px] text-pretty text-sm font-new text-[#383838]">
                    <p>
                        {getItem.about}
                    </p>
                </div>
            </div>
            <div className="flex justify-center gap-4 items-center w-full px-8 py-5">

                <button className="rounded-full h-12 w-1/2 px-6  placeholder-zinc-700 outline-none ring-2 ring-zinc-400 border-transparent text-zinc-400 text-lg font-bold">
                    {getItem.price === "0" ? "0" : `$${getItem.price}`}
                </button>
                <button className="rounded-[30px] bg-[#030712] h-12 w-1/2 text-white font-new text-lg font-medium">
                    {getItem.price === "0" ? "Gratis" : `Comprar entrada`}
                </button>
            </div>
            <div className="px-8 pt-4">
                <h2 className="text-xl font-new pb-[11px] pl-[9px]">Ubicación aproximada</h2>
                <div className="rounded-3xl bg-[#030712] text-pretty text-sm font-new overflow-hidden">
                    <div className="relative h-[260px] w-full">
                        <LoadScript googleMapsApiKey="AIzaSyAcyybGF_nvmxoVvN4V3BZ6meekjSrTpxE" libraries={['places']}>
                            {window.google && window.google.maps && (
                                <div className="rounded-3xl overflow-hidden w-full h-full ">
                                    <GoogleMap
                                        mapContainerStyle={{ height: "200px", width: "100%" }}
                                        center={{ lat: Lat, lng: lng }}
                                        zoom={13}
                                        options={{
                                            disableDefaultUI: true, // Desactiva todos los controles predeterminados del mapa
                                            styles: [
                                                {
                                                    featureType: "water",
                                                    elementType: "geometry",
                                                    stylers: [
                                                        { color: "#193341" }
                                                    ]
                                                },
                                                {
                                                    featureType: "landscape",
                                                    elementType: "geometry",
                                                    stylers: [
                                                        { color: "#09090b" }
                                                    ]
                                                },
                                                {
                                                    featureType: "road",
                                                    elementType: "geometry",
                                                    stylers: [
                                                        { color: "#27272a" } // Oculta iconos de carretera como peajes, estaciones de servicio, etc.
                                                    ]
                                                },
                                                {
                                                    featureType: "poi",
                                                    stylers: [
                                                        { visibility: "off" } // Oculta puntos de interés como tiendas, restaurantes, etc.
                                                    ]
                                                },
                                                {
                                                    featureType: "transit",
                                                    elementType: "labels.icon",
                                                    stylers: [
                                                        { visibility: "off" } // Oculta iconos de transporte público
                                                    ]
                                                },
                                                {
                                                    featureType: "road",
                                                    elementType: "labels.icon",
                                                    stylers: [
                                                        { visibility: "off" } // Oculta iconos de carretera como peajes, estaciones de servicio, etc.
                                                    ]
                                                },
                                                {
                                                    featureType: "administrative",
                                                    elementType: "labels.text.fill",
                                                    stylers: [
                                                        { color: "#ffffff" } // Cambia el color del texto administrativo (por ejemplo, el nombre de las ciudades)
                                                    ]
                                                },
                                                {
                                                    featureType: "administrative.locality",
                                                    elementType: "labels.text.fill",
                                                    stylers: [
                                                        { visibility: "off" } // Oculta el nombre de las localidades (ciudades, pueblos, etc.)
                                                    ]
                                                },
                                                {
                                                    featureType: "administrative.neighborhood",
                                                    elementType: "labels.text.fill",
                                                    stylers: [
                                                        { visibility: "off" } // Oculta el nombre de los barrios
                                                    ]
                                                },
                                                {
                                                    featureType: "road",
                                                    elementType: "labels.text.fill",
                                                    stylers: [
                                                        { visibility: "off" } // Oculta iconos de carretera como peajes, estaciones de servicio, etc.
                                                    ]
                                                },
                                            ]
                                        }}
                                    >

                                        <Marker
                                            position={{
                                                lat: Lat,
                                                lng: lng
                                            }}
                                            options={
                                                {
                                                    icon: {
                                                        url: "/Ellipse12.png",
                                                        scaledSize: new window.google.maps.Size(40, 40)
                                                    }
                                                }
                                            }
                                        />

                                    </GoogleMap>
                                </div>
                            )}
                            <div className="px-4 py-[10px] text-white font-new text-sm absolute bottom-0 left-0 w-full">
                                {nameLocation}
                            </div>
                        </LoadScript>
                    </div>
                </div>
            </div>
            <div className="flex justify-center items-center w-full py-9">
                <button className="rounded-[25px] bg-[#030712] h-[60px] w-72 text-white font-new text-2xl font-normal">
                    Inscribirse
                </button>
            </div>
            <div className="pt-4">
                <h2 className="text-xl font-new pb-[11px] pl-[41px]">Comentarios</h2>
                <div className="flex justify-start items-center h-20 px-8 gap-4">
                    <figure className="flex flex-none justify-start h-full w-[45xp]">
                        <Image
                            className="w-[45xp] h-[45px] rounded-full border-2 border-zinc-300"
                            src="/Ellipse4.png"
                            alt="User image"
                            height={45}
                            width={45}
                        />
                    </figure>
                    <div className="flex flex-col justify-between h-full w-full p-[6px]">
                        <div>
                            <p className="text-black text-xs font-new">Excelente organización y ambiente, ¡me encantó cada momento!</p>
                        </div>
                        <div className="flex justify-between">
                            <button className="bg-[#030712] rounded-xl h-5 px-2 py-0.5 text-xs text-white font-new font-bold uppercase">Responder</button>
                            <button className="flex justify-center items-center bg-[#030712] rounded-xl h-5 w-5 mr-5">
                                <svg
                                    className="hover:scale-125 transition-[transform_fill] ease-in-out fill-[#F2F2F2]"
                                    xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 13 13" fill="none">
                                    <g id="ic:round-favorite">
                                        <path id="Vector" d="M7.23139 10.9037C6.81973 11.2775 6.18598 11.2775 5.77431 10.8983L5.71473 10.8442C2.87098 8.27124 1.01306 6.58665 1.08348 4.48499C1.11598 3.56415 1.58723 2.68124 2.35098 2.16124C3.78098 1.18624 5.54681 1.64124 6.50014 2.75707C7.45348 1.64124 9.21931 1.18082 10.6493 2.16124C11.4131 2.68124 11.8843 3.56415 11.9168 4.48499C11.9926 6.58665 10.1293 8.27124 7.28556 10.855L7.23139 10.9037Z" />
                                    </g>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
                <hr />
            </div>
        </section>
    )
}