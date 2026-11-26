--
-- PostgreSQL database dump
--

\restrict 4IB5ia5qcNmOm20kczWXNEsNiwevpsAnKSoqD2UHDunQJCgBKphDHcAaftjlm0r

-- Dumped from database version 17.12
-- Dumped by pg_dump version 17.12

-- Started on 2026-11-26 12:19:18

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 219 (class 1259 OID 24591)
-- Name: pedidos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.pedidos (
    pedido_id integer NOT NULL,
    cantidad integer NOT NULL,
    costo_envio numeric(10,2) NOT NULL,
    subtotal numeric(10,2) NOT NULL,
    total_pedido numeric(10,2) NOT NULL,
    user_id integer NOT NULL,
    producto_id integer NOT NULL
);


ALTER TABLE public.pedidos OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 24607)
-- Name: pedidos_pedido_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.pedidos ALTER COLUMN pedido_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.pedidos_pedido_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 218 (class 1259 OID 24584)
-- Name: productos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.productos (
    producto_id integer NOT NULL,
    nombre_producto character varying(50) NOT NULL,
    categoria character varying(10) NOT NULL,
    descripcion character varying(100) NOT NULL,
    precio numeric(10,2) NOT NULL,
    colores character varying(100) NOT NULL,
    tamanos character varying(20) NOT NULL,
    imagen character varying(500) NOT NULL
);


ALTER TABLE public.productos OWNER TO postgres;

--
-- TOC entry 222 (class 1259 OID 24608)
-- Name: productos_producto_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.productos ALTER COLUMN producto_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.productos_producto_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 217 (class 1259 OID 24576)
-- Name: usuarios; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.usuarios (
    user_id integer NOT NULL,
    nombre_usuario character varying(50) NOT NULL,
    telefono_usuario character varying(10) NOT NULL,
    correo character varying(100) NOT NULL,
    contrasena character varying(20) NOT NULL,
    CONSTRAINT usuarios_contrasena_check CHECK ((length((contrasena)::text) >= 6))
);


ALTER TABLE public.usuarios OWNER TO postgres;

--
-- TOC entry 220 (class 1259 OID 24606)
-- Name: usuarios_user_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.usuarios ALTER COLUMN user_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.usuarios_user_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 4910 (class 0 OID 24591)
-- Dependencies: 219
-- Data for Name: pedidos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.pedidos (pedido_id, cantidad, costo_envio, subtotal, total_pedido, user_id, producto_id) FROM stdin;
1	1	12000.00	23000.00	35000.00	1	1
\.


--
-- TOC entry 4909 (class 0 OID 24584)
-- Dependencies: 218
-- Data for Name: productos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.productos (producto_id, nombre_producto, categoria, descripcion, precio, colores, tamanos, imagen) FROM stdin;
1	loro papitas	animales	loro  que te acompaña a donde vayas	23000.00	verde	l	https://lh3.googleusercontent.com/d/1Owbym39ZNg6X-FYQz1k-aMOBziWOJQqA
\.


--
-- TOC entry 4908 (class 0 OID 24576)
-- Dependencies: 217
-- Data for Name: usuarios; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.usuarios (user_id, nombre_usuario, telefono_usuario, correo, contrasena) FROM stdin;
1	pedro	340321832	pedro@gmail.com	79klopoca
\.


--
-- TOC entry 4919 (class 0 OID 0)
-- Dependencies: 221
-- Name: pedidos_pedido_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.pedidos_pedido_id_seq', 1, true);


--
-- TOC entry 4920 (class 0 OID 0)
-- Dependencies: 222
-- Name: productos_producto_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.productos_producto_id_seq', 1, true);


--
-- TOC entry 4921 (class 0 OID 0)
-- Dependencies: 220
-- Name: usuarios_user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.usuarios_user_id_seq', 1, true);


--
-- TOC entry 4760 (class 2606 OID 24595)
-- Name: pedidos pedidos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pedidos
    ADD CONSTRAINT pedidos_pkey PRIMARY KEY (pedido_id);


--
-- TOC entry 4758 (class 2606 OID 24590)
-- Name: productos productos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.productos
    ADD CONSTRAINT productos_pkey PRIMARY KEY (producto_id);


--
-- TOC entry 4754 (class 2606 OID 24583)
-- Name: usuarios usuarios_correo_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_correo_key UNIQUE (correo);


--
-- TOC entry 4756 (class 2606 OID 24581)
-- Name: usuarios usuarios_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_pkey PRIMARY KEY (user_id);


--
-- TOC entry 4761 (class 2606 OID 24601)
-- Name: pedidos pedidos_producto_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pedidos
    ADD CONSTRAINT pedidos_producto_id_fkey FOREIGN KEY (producto_id) REFERENCES public.productos(producto_id);


--
-- TOC entry 4762 (class 2606 OID 24596)
-- Name: pedidos pedidos_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pedidos
    ADD CONSTRAINT pedidos_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.usuarios(user_id);


-- Completed on 2026-11-26 12:19:18

--
-- PostgreSQL database dump complete
--

\unrestrict 4IB5ia5qcNmOm20kczWXNEsNiwevpsAnKSoqD2UHDunQJCgBKphDHcAaftjlm0r

