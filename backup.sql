--
-- PostgreSQL database dump
--

\restrict il83J4bpaO2ytAgfJ7uR02F9Y7pcIaN75pLgxpGcUv0usgK2cI8l8kqItLgvjN6

-- Dumped from database version 18.1
-- Dumped by pg_dump version 18.1

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

--
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;


--
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: customers; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.customers (
    customer_id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid,
    name character varying(150) NOT NULL,
    email character varying(120),
    region character varying(50),
    address text,
    phone character varying(40),
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.customers OWNER TO postgres;

--
-- Name: order_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.order_items (
    order_item_id uuid DEFAULT gen_random_uuid() NOT NULL,
    order_id uuid NOT NULL,
    product_id uuid NOT NULL,
    quantity integer NOT NULL,
    subtotal numeric(12,2) NOT NULL,
    CONSTRAINT order_items_quantity_check CHECK ((quantity > 0))
);


ALTER TABLE public.order_items OWNER TO postgres;

--
-- Name: orders; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.orders (
    order_id uuid DEFAULT gen_random_uuid() NOT NULL,
    customer_id uuid NOT NULL,
    order_date timestamp without time zone DEFAULT now(),
    shipping_address text,
    billing_address text,
    total_amount numeric(12,2) DEFAULT 0.00 NOT NULL,
    status character varying(30) NOT NULL,
    notes text,
    CONSTRAINT orders_status_check CHECK (((status)::text = ANY ((ARRAY['Pending'::character varying, 'Paid'::character varying, 'Shipped'::character varying, 'Completed'::character varying, 'Cancelled'::character varying])::text[])))
);


ALTER TABLE public.orders OWNER TO postgres;

--
-- Name: payments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.payments (
    payment_id uuid DEFAULT gen_random_uuid() NOT NULL,
    order_id uuid NOT NULL,
    customer_id uuid NOT NULL,
    payment_method character varying(50),
    payment_status character varying(30) DEFAULT 'Paid'::character varying,
    transaction_id character varying(200),
    payment_date timestamp without time zone DEFAULT now(),
    amount_paid numeric(12,2) NOT NULL
);


ALTER TABLE public.payments OWNER TO postgres;

--
-- Name: products; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.products (
    product_id uuid DEFAULT gen_random_uuid() NOT NULL,
    product_name character varying(200) NOT NULL,
    category character varying(100),
    description text,
    image_url text,
    price numeric(10,2) DEFAULT 0.00 NOT NULL,
    stock_quantity integer DEFAULT 0 NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.products OWNER TO postgres;

--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    user_id uuid DEFAULT gen_random_uuid() NOT NULL,
    email character varying(120) NOT NULL,
    password_hash character varying(255) NOT NULL,
    role character varying(30) NOT NULL,
    created_at timestamp without time zone DEFAULT now(),
    CONSTRAINT users_role_check CHECK (((role)::text = ANY ((ARRAY['admin'::character varying, 'staff'::character varying, 'customer'::character varying])::text[])))
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Data for Name: customers; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.customers (customer_id, user_id, name, email, region, address, phone, created_at) FROM stdin;
df4b0d97-7ffc-4769-a665-39ecf5903efa	42017061-4e28-423a-9ca6-18b155c71dc8		jean.ran@gmail.com				2025-11-28 17:10:56.595406
fd9fa092-6a1b-4da1-9cd3-1fbbef8ad58f	7a0732d5-5375-4fd4-aa1a-1551cff90949		ran.jean@gmail.com				2025-11-28 17:58:05.319647
d96d9634-e1f9-4e09-b978-0d6a2883dc4c	548e0cf2-e35b-465e-b470-46c57b2e51bf		salvaleon@gmail.com				2025-11-28 18:08:46.617169
bdaa325e-14ee-47e5-9aea-d987ce5e6274	cb8d28f4-e471-4d2a-9ae9-85974090e58b		sam@gmail.com				2025-11-29 08:40:39.092955
86c7fa1f-77ba-43b3-9c9c-c3d124eda523	fbd191b7-ae12-4b28-ad94-57174c7722be		stephanie@gmail.com				2025-11-29 09:03:42.975269
846ee012-f076-44b6-a2ab-94dde36ab1d4	edec3850-1631-4896-9ce4-204c4fe97a04		ranoajeanalie@gmail.com				2025-11-29 23:56:10.321241
e2f1a4d6-4436-4a6a-9c10-2c568cfbbb24	\N	tep	salvaleon.stephanie15@gmail.com	x	balingasag	09127937609	2025-11-29 22:07:32.671863
ad180c4d-d341-466f-bfe5-fb08f399994e	f918e49f-2c5f-4aa5-900f-ca749aba0df5	STEPH	salvaleon.stephanie15@gmail.com	X	CDO	09127937609	2025-11-30 01:04:02.726743
\.


--
-- Data for Name: order_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.order_items (order_item_id, order_id, product_id, quantity, subtotal) FROM stdin;
0ae2430a-d601-449b-834a-3f28190271cc	34d7fbd4-e886-4c87-aa5f-bac287e90647	2a107516-c6c9-4e06-85a7-c83a783ad8f2	1	14.99
a03d70b1-ec07-44ad-8630-2f1667a8952a	8d73eac4-f4cd-4a0a-a411-785bfb4f7cf5	5d4bc61c-5698-4c4d-a4bd-f2dbcf2ba0ae	1	15.50
00636225-198a-4b3c-b3cc-da14e550d6a8	ffc52f4f-378e-441f-93a9-098cec4cf6e1	dea81793-2374-493a-9728-9efba52cabe2	1	13.99
ad634419-4579-42be-ba0c-078431cdf5c9	c5520015-c333-41a0-ab09-ef9b079245ba	da73afa5-131f-40d9-b7b2-d7c75929460d	1	11.50
69b8bb1f-e85d-4144-aa4c-e2dd488519ba	671a9328-3305-4c4d-8d30-648b3d84649d	2a107516-c6c9-4e06-85a7-c83a783ad8f2	1	14.99
27a59fa6-d3bc-41d7-8c1b-4e20637e8a8d	4d6ed601-ef7f-4e29-a5cf-90c2698e6724	2a107516-c6c9-4e06-85a7-c83a783ad8f2	1	14.99
fa85f881-f76a-4f3b-ab52-a8465d1e6c5b	bbdc9eae-df9d-4833-9ee5-8ac1ce0a256f	694bb2fa-85d9-4d4f-af40-bde572d456f3	1	16.00
de36f01e-38ba-47ea-93b8-7513861c7098	56ee0f7a-5939-494a-8b0c-f85ddf30ae56	96ffaa09-b70d-46e8-bfd6-c74141bc0845	2	28.50
2948ab48-3254-454e-99c6-c3ab7f2248e6	56ee0f7a-5939-494a-8b0c-f85ddf30ae56	e59fe56b-3572-44e9-9c57-4052d211b1a8	1	13.75
7c5f486e-25d5-455f-8489-2e11b9e144cb	fc0a0e0f-0795-4b93-97d5-41efb2e5a874	2a107516-c6c9-4e06-85a7-c83a783ad8f2	1	14.99
b76958e2-0518-4011-b2fe-474201baed98	1f192aac-6723-4725-b600-42424510e7c7	2a107516-c6c9-4e06-85a7-c83a783ad8f2	1	14.99
da8304b5-e3fd-4f83-a135-9b87454a4c7a	b38cf1c7-a9e9-4c2f-b8bc-6aa2239e0013	379f2178-4a03-4894-b45a-f65b914fd45f	6	107.94
3060dbd9-7281-4811-9fe3-5c24705f831c	719ef696-45ce-47b8-a999-704cf3db91f8	ef762b74-57af-4d72-8ca6-e3e9cd316db2	1	12.50
43fc809a-34b7-472b-9003-109012f410b0	719ef696-45ce-47b8-a999-704cf3db91f8	2a107516-c6c9-4e06-85a7-c83a783ad8f2	1	14.99
bb092da0-181a-46a5-b748-55a5469f9e11	9d37a829-4d64-4a05-bdff-da809abfb981	2a107516-c6c9-4e06-85a7-c83a783ad8f2	1	14.99
89a7540e-ae33-4ff3-a833-361a7854454f	198f8157-2de9-4768-8997-1c3bc74d1bb0	2a107516-c6c9-4e06-85a7-c83a783ad8f2	1	14.99
bb599b7d-16d0-40eb-aafd-6108c6818407	b2c59847-2968-4e33-8bf4-b73debd0ebe7	2a107516-c6c9-4e06-85a7-c83a783ad8f2	1	14.99
3caf84f9-8c95-48fb-b8a9-b95a394d448d	b54cd199-5c8c-4e49-9508-1662f8e574cc	2a107516-c6c9-4e06-85a7-c83a783ad8f2	1	14.99
1a0ce9a0-fe1e-4c0a-aaa7-2d428f04236a	e3d646fc-9b65-4f75-b497-38f152e5825a	a82da774-6db1-455c-956f-f21173d9e2a3	1	15.99
a4a54e60-bdab-421c-ba65-2c1f69b521f0	e3d646fc-9b65-4f75-b497-38f152e5825a	a143b15c-a774-48d6-8662-bc44f0170cb7	15	179.85
690a72d5-437b-4f1b-9544-e183bec1c3cf	3b032590-da48-4392-b683-bcca9aa57624	2a107516-c6c9-4e06-85a7-c83a783ad8f2	1	14.99
0ec09798-8738-4134-ab4c-d8acd65a6549	3c602c73-1565-436f-a4ef-52059290b1a5	2a107516-c6c9-4e06-85a7-c83a783ad8f2	12	179.88
6db353b7-4ff4-460e-9f0b-591043470dff	c8d65456-88be-42fe-92ad-45807b80acc6	3d11317d-669f-48ad-9efb-10f77083fbf1	18	243.00
969041e3-302f-4d0a-a75e-54e2d2ec9d55	40cc5626-452a-4542-aaac-2c680e439d7d	2a107516-c6c9-4e06-85a7-c83a783ad8f2	1	14.99
bea5e4cd-82e8-4bf5-96a0-a1c5ec4429ba	5ed6e808-53a8-4c43-9f61-654fb45c69b0	28ad5ac3-8d80-4258-b34a-22d20cebff27	1	12.99
f037d041-faa6-43cb-a2b1-81746a5ea1ef	6b6ab605-82cf-4564-821f-493a0d590b95	2a107516-c6c9-4e06-85a7-c83a783ad8f2	1	14.99
df30b4e7-543a-4990-9315-9305558c4b41	18c19e6f-e63e-4d89-86cb-86aadcd9ab49	df8d33a1-3a3e-4ac1-a389-97555cf9098f	2	33.00
8551ec07-c60f-4363-bd0b-993e2a3a4e2b	129bdba7-e1c9-42a4-9b4c-e01fc4256d2a	a2ad9e7f-3830-4c36-ac43-0cf07acd0869	1	12.75
0a9f4366-7194-479b-82f2-f4dc3c19f8f0	80194821-d2f1-4517-bd5c-ac4089d69860	13cbfd70-7f05-472c-a78b-d0c13563b31d	2	25.98
348a4cbc-4d01-4740-9e61-dfcdabe245fa	162b6081-84ea-4539-99ff-ab0f301501f0	ebac5bf3-df53-44a5-90b1-fb4afd25fcb6	1	100.00
3c7a4599-05da-4238-952c-672836f1a87c	3a57e43b-4b69-4e3c-84f6-5d7b3169a9a1	5d4bc61c-5698-4c4d-a4bd-f2dbcf2ba0ae	1	15.50
\.


--
-- Data for Name: orders; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.orders (order_id, customer_id, order_date, shipping_address, billing_address, total_amount, status, notes) FROM stdin;
34d7fbd4-e886-4c87-aa5f-bac287e90647	bdaa325e-14ee-47e5-9aea-d987ce5e6274	2025-11-29 09:03:49.744976	\N	\N	14.99	Paid	\N
8d73eac4-f4cd-4a0a-a411-785bfb4f7cf5	bdaa325e-14ee-47e5-9aea-d987ce5e6274	2025-11-29 09:07:34.247838	\N	\N	15.50	Paid	\N
ffc52f4f-378e-441f-93a9-098cec4cf6e1	bdaa325e-14ee-47e5-9aea-d987ce5e6274	2025-11-29 09:29:35.360378	\N	\N	13.99	Paid	\N
c5520015-c333-41a0-ab09-ef9b079245ba	bdaa325e-14ee-47e5-9aea-d987ce5e6274	2025-11-29 09:29:44.533103	\N	\N	11.50	Paid	\N
671a9328-3305-4c4d-8d30-648b3d84649d	bdaa325e-14ee-47e5-9aea-d987ce5e6274	2025-11-29 09:33:55.834138	\N	\N	14.99	Paid	\N
4d6ed601-ef7f-4e29-a5cf-90c2698e6724	bdaa325e-14ee-47e5-9aea-d987ce5e6274	2025-11-29 09:34:30.085218	\N	\N	14.99	Paid	\N
56ee0f7a-5939-494a-8b0c-f85ddf30ae56	bdaa325e-14ee-47e5-9aea-d987ce5e6274	2025-11-29 09:52:14.646539	Cagayan de Oro City	Cagayan de Oro City	42.25	Paid	\N
fc0a0e0f-0795-4b93-97d5-41efb2e5a874	bdaa325e-14ee-47e5-9aea-d987ce5e6274	2025-11-29 10:01:15.502201	Purok 3	Purok 3	14.99	Paid	\N
1f192aac-6723-4725-b600-42424510e7c7	bdaa325e-14ee-47e5-9aea-d987ce5e6274	2025-11-29 10:16:59.113725	\N	\N	14.99	Paid	\N
b38cf1c7-a9e9-4c2f-b8bc-6aa2239e0013	bdaa325e-14ee-47e5-9aea-d987ce5e6274	2025-11-29 10:19:41.210965	Osmena\n	Osmena\n	107.94	Paid	\N
719ef696-45ce-47b8-a999-704cf3db91f8	bdaa325e-14ee-47e5-9aea-d987ce5e6274	2025-11-29 10:31:09.420231	ncshjdbhfbsifj	ncshjdbhfbsifj	27.49	Paid	\N
9d37a829-4d64-4a05-bdff-da809abfb981	bdaa325e-14ee-47e5-9aea-d987ce5e6274	2025-11-29 10:49:39.006469	Cagayan de Oro\n	Cagayan de Oro\n	14.99	Paid	\N
198f8157-2de9-4768-8997-1c3bc74d1bb0	bdaa325e-14ee-47e5-9aea-d987ce5e6274	2025-11-29 10:49:59.163387	\N	\N	14.99	Paid	\N
b2c59847-2968-4e33-8bf4-b73debd0ebe7	bdaa325e-14ee-47e5-9aea-d987ce5e6274	2025-11-29 10:50:09.453367	\N	\N	14.99	Paid	\N
b54cd199-5c8c-4e49-9508-1662f8e574cc	bdaa325e-14ee-47e5-9aea-d987ce5e6274	2025-11-29 10:50:38.239566	Cagayan de Oro	Cagayan de Oro	14.99	Paid	\N
e3d646fc-9b65-4f75-b497-38f152e5825a	bdaa325e-14ee-47e5-9aea-d987ce5e6274	2025-11-29 10:51:27.913077	diri ra	diri ra	195.84	Paid	\N
3b032590-da48-4392-b683-bcca9aa57624	bdaa325e-14ee-47e5-9aea-d987ce5e6274	2025-11-29 10:55:42.787489	\N	\N	14.99	Paid	\N
3c602c73-1565-436f-a4ef-52059290b1a5	bdaa325e-14ee-47e5-9aea-d987ce5e6274	2025-11-29 11:00:40.186586	Cagayan de Oro City Osmena	Cagayan de Oro City Osmena	179.88	Paid	\N
c8d65456-88be-42fe-92ad-45807b80acc6	bdaa325e-14ee-47e5-9aea-d987ce5e6274	2025-11-29 11:01:07.559174	sdfds	sdfds	243.00	Paid	\N
40cc5626-452a-4542-aaac-2c680e439d7d	e2f1a4d6-4436-4a6a-9c10-2c568cfbbb24	2025-11-29 22:10:34.963558	cdo	cdo	14.99	Paid	\N
5ed6e808-53a8-4c43-9f61-654fb45c69b0	e2f1a4d6-4436-4a6a-9c10-2c568cfbbb24	2025-11-29 22:10:52.913224	lapasan	lapasan	12.99	Paid	\N
6b6ab605-82cf-4564-821f-493a0d590b95	846ee012-f076-44b6-a2ab-94dde36ab1d4	2025-11-30 00:56:14.266493	lapaz 1	lapaz 1	14.99	Paid	\N
18c19e6f-e63e-4d89-86cb-86aadcd9ab49	846ee012-f076-44b6-a2ab-94dde36ab1d4	2025-11-30 00:56:45.802036	lapaz 1	lapaz 1	33.00	Paid	\N
129bdba7-e1c9-42a4-9b4c-e01fc4256d2a	ad180c4d-d341-466f-bfe5-fb08f399994e	2025-11-30 01:04:25.633301	balingasag	balingasag	12.75	Paid	\N
80194821-d2f1-4517-bd5c-ac4089d69860	ad180c4d-d341-466f-bfe5-fb08f399994e	2025-11-30 01:04:55.015389	balingasag	balingasag	25.98	Paid	\N
162b6081-84ea-4539-99ff-ab0f301501f0	ad180c4d-d341-466f-bfe5-fb08f399994e	2025-11-30 01:16:24.005594	CDO	CDO	100.00	Paid	\N
3a57e43b-4b69-4e3c-84f6-5d7b3169a9a1	ad180c4d-d341-466f-bfe5-fb08f399994e	2025-11-30 01:30:38.183997	lapaz 1	lapaz 1	15.50	Paid	\N
bbdc9eae-df9d-4833-9ee5-8ac1ce0a256f	bdaa325e-14ee-47e5-9aea-d987ce5e6274	2025-11-29 09:45:39.019625	\N	\N	16.00	Pending	\N
\.


--
-- Data for Name: payments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.payments (payment_id, order_id, customer_id, payment_method, payment_status, transaction_id, payment_date, amount_paid) FROM stdin;
29d33ec3-2fc1-49a6-9199-fec60079b45c	34d7fbd4-e886-4c87-aa5f-bac287e90647	bdaa325e-14ee-47e5-9aea-d987ce5e6274	Cash on Delivery	Paid	\N	2025-11-29 09:03:49.744976	14.99
564aef36-06a3-4c90-9869-987c91f43987	8d73eac4-f4cd-4a0a-a411-785bfb4f7cf5	bdaa325e-14ee-47e5-9aea-d987ce5e6274	Cash on Delivery	Paid	\N	2025-11-29 09:07:34.247838	15.50
dd6f7ebf-416c-44b8-83da-c7f159c0a25a	ffc52f4f-378e-441f-93a9-098cec4cf6e1	bdaa325e-14ee-47e5-9aea-d987ce5e6274	Cash on Delivery	Paid	\N	2025-11-29 09:29:35.360378	13.99
fd43496b-9d09-482b-824f-919307a0ee49	c5520015-c333-41a0-ab09-ef9b079245ba	bdaa325e-14ee-47e5-9aea-d987ce5e6274	GCash	Paid	\N	2025-11-29 09:29:44.533103	11.50
6037cff3-fc9b-4bd2-aa90-ef1b3af270d1	671a9328-3305-4c4d-8d30-648b3d84649d	bdaa325e-14ee-47e5-9aea-d987ce5e6274	Cash on Delivery	Paid	\N	2025-11-29 09:33:55.834138	14.99
70466c29-84ab-4efb-8110-4fcaa588b784	4d6ed601-ef7f-4e29-a5cf-90c2698e6724	bdaa325e-14ee-47e5-9aea-d987ce5e6274	Cash on Delivery	Paid	\N	2025-11-29 09:34:30.085218	14.99
1a994014-905f-46c8-88e1-23ef80c85a39	bbdc9eae-df9d-4833-9ee5-8ac1ce0a256f	bdaa325e-14ee-47e5-9aea-d987ce5e6274	Cash on Delivery	Paid	\N	2025-11-29 09:45:39.019625	16.00
f0f06dff-7b9d-42a2-b457-963600cc39ab	56ee0f7a-5939-494a-8b0c-f85ddf30ae56	bdaa325e-14ee-47e5-9aea-d987ce5e6274	Bank Transfer	Paid	\N	2025-11-29 09:52:14.646539	42.25
ba835abe-9a84-45ae-b459-652945f65950	fc0a0e0f-0795-4b93-97d5-41efb2e5a874	bdaa325e-14ee-47e5-9aea-d987ce5e6274	Cash on Delivery	Paid	\N	2025-11-29 10:01:15.502201	14.99
93a4e1f1-727d-4229-ac04-54d34faad94d	1f192aac-6723-4725-b600-42424510e7c7	bdaa325e-14ee-47e5-9aea-d987ce5e6274	Cash on Delivery	Paid	\N	2025-11-29 10:16:59.113725	14.99
3d68f526-6da6-4cd8-9974-8b3a77d3aebd	b38cf1c7-a9e9-4c2f-b8bc-6aa2239e0013	bdaa325e-14ee-47e5-9aea-d987ce5e6274	Cash on Delivery	Paid	\N	2025-11-29 10:19:41.210965	107.94
3e5a99c5-68aa-412e-afdb-f2c8c549873a	719ef696-45ce-47b8-a999-704cf3db91f8	bdaa325e-14ee-47e5-9aea-d987ce5e6274	Bank Transfer	Paid	\N	2025-11-29 10:31:09.420231	27.49
70901a62-6842-472d-900d-f55bcc61c665	9d37a829-4d64-4a05-bdff-da809abfb981	bdaa325e-14ee-47e5-9aea-d987ce5e6274	PayMaya	Paid	\N	2025-11-29 10:49:39.006469	14.99
05ef42d4-1c45-4047-8cb0-3e25f6d62781	198f8157-2de9-4768-8997-1c3bc74d1bb0	bdaa325e-14ee-47e5-9aea-d987ce5e6274	Cash on Delivery	Paid	\N	2025-11-29 10:49:59.163387	14.99
4a822469-8463-4aeb-874f-c1fafcf9d060	b2c59847-2968-4e33-8bf4-b73debd0ebe7	bdaa325e-14ee-47e5-9aea-d987ce5e6274	Cash on Delivery	Paid	\N	2025-11-29 10:50:09.453367	14.99
0eea1a26-b52d-4cc0-9fc4-0d4aa181c438	b54cd199-5c8c-4e49-9508-1662f8e574cc	bdaa325e-14ee-47e5-9aea-d987ce5e6274	Debit/Credit Card	Paid	\N	2025-11-29 10:50:38.239566	14.99
704440ab-dfa6-4f0f-82c0-a8e85aa6bb76	e3d646fc-9b65-4f75-b497-38f152e5825a	bdaa325e-14ee-47e5-9aea-d987ce5e6274	Bank Transfer	Paid	\N	2025-11-29 10:51:27.913077	195.84
dd8120f4-0c11-44ae-896f-a3037130acff	3b032590-da48-4392-b683-bcca9aa57624	bdaa325e-14ee-47e5-9aea-d987ce5e6274	Cash on Delivery	Paid	\N	2025-11-29 10:55:42.787489	14.99
7bba506d-5b45-42f0-b404-8f5580f1ee16	3c602c73-1565-436f-a4ef-52059290b1a5	bdaa325e-14ee-47e5-9aea-d987ce5e6274	Cash on Delivery	Paid	\N	2025-11-29 11:00:40.186586	179.88
ccb410e5-be40-47e5-bf64-0225c0f8f4db	c8d65456-88be-42fe-92ad-45807b80acc6	bdaa325e-14ee-47e5-9aea-d987ce5e6274	Cash on Delivery	Paid	\N	2025-11-29 11:01:07.559174	243.00
1152483e-df8a-42ba-884c-100f2d5acd29	40cc5626-452a-4542-aaac-2c680e439d7d	e2f1a4d6-4436-4a6a-9c10-2c568cfbbb24	Cash on Delivery	Paid	\N	2025-11-29 22:10:34.963558	14.99
a234b751-0345-4478-9ab8-0be92f3bd5cd	5ed6e808-53a8-4c43-9f61-654fb45c69b0	e2f1a4d6-4436-4a6a-9c10-2c568cfbbb24	Cash on Delivery	Paid	\N	2025-11-29 22:10:52.913224	12.99
d7f0702b-c4b6-4a23-b280-28430a285d14	6b6ab605-82cf-4564-821f-493a0d590b95	846ee012-f076-44b6-a2ab-94dde36ab1d4	Cash on Delivery	Paid	\N	2025-11-30 00:56:14.266493	14.99
3091ba33-00b9-4362-aea8-aa15f26a4453	18c19e6f-e63e-4d89-86cb-86aadcd9ab49	846ee012-f076-44b6-a2ab-94dde36ab1d4	Cash on Delivery	Paid	\N	2025-11-30 00:56:45.802036	33.00
cb7dfa63-3443-496b-be40-858a022abe0d	129bdba7-e1c9-42a4-9b4c-e01fc4256d2a	ad180c4d-d341-466f-bfe5-fb08f399994e	Cash on Delivery	Paid	\N	2025-11-30 01:04:25.633301	12.75
be539014-6315-492f-b511-931c94cc67d8	80194821-d2f1-4517-bd5c-ac4089d69860	ad180c4d-d341-466f-bfe5-fb08f399994e	Cash on Delivery	Paid	\N	2025-11-30 01:04:55.015389	25.98
f21b77f7-463b-4110-8351-9faedfce1b53	162b6081-84ea-4539-99ff-ab0f301501f0	ad180c4d-d341-466f-bfe5-fb08f399994e	Cash on Delivery	Paid	\N	2025-11-30 01:16:24.005594	100.00
c08a7ef3-bc6c-4088-b515-bdaa049ab1f6	3a57e43b-4b69-4e3c-84f6-5d7b3169a9a1	ad180c4d-d341-466f-bfe5-fb08f399994e	Cash on Delivery	Paid	\N	2025-11-30 01:30:38.183997	15.50
\.


--
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.products (product_id, product_name, category, description, image_url, price, stock_quantity, is_active, created_at, updated_at) FROM stdin;
baf62309-a680-4a85-a476-5f2c3f2f9dd1	Slim Fit V-Neck Shirt	shirts	Slim silhouette with lightweight fabric for a clean modern look.	https://example.com/images/shirt2.jpg	14.99	25	t	2025-11-27 12:49:09.718434	2025-11-27 12:49:09.718434
717c7a10-b76e-42f1-9a04-51bf6243b4e0	Tie-Dye Unisex Tee	shirts	Hand-dyed style, unique patterns.	https://example.com/images/shirt14.jpg	14.00	19	t	2025-11-27 12:49:09.718434	2025-11-27 12:49:09.718434
ef762b74-57af-4d72-8ca6-e3e9cd316db2	Retro Ringer Tee	shirts	Vintage contrast trims, soft cotton.	https://example.com/images/shirt10.jpg	12.50	23	t	2025-11-27 12:49:09.718434	2025-11-27 12:49:09.718434
2a107516-c6c9-4e06-85a7-c83a783ad8f2	Slim Fit V-Neck Shirt	Shirts	Comfortable and stylish V-neck tee	https://i5.walmartimages.com/seo/CHGBMOK-Shirts-for-Men-Slim-Fit-V-Neck-T-Shirts-for-Men-Super-Soft-V-Neck-T-Shirts-for-Men-Multipack-Tees-S-3XL_f5b34b40-23f6-459e-85ef-12c85af92076.a45af5602f9e2b73e23405d62b8ab0cd.jpeg	100.99	6	t	2025-11-28 15:43:37.207802	2025-11-28 15:43:37.207802
5d4bc61c-5698-4c4d-a4bd-f2dbcf2ba0ae	Oversized Streetwear Tee	shirts	Heavyweight cotton with relaxed drape; ideal for street style outfits.	https://example.com/images/shirt3.jpg	15.50	28	t	2025-11-27 12:49:09.718434	2025-11-27 12:49:09.718434
518eddd7-08e4-4dc3-b1a6-3e0a15f309f8	Lightweight Summer Tee	shirts	Soft and thin fabric for hot weather.	https://i5.walmartimages.com/seo/BLVB-Button-down-Shirts-for-Women-Lapel-Long-Sleeve-Cotton-Linen-Tops-Causal-Lightweight-Summer-Spring-Blouse-Tees-Plus-Size_637674ff-6723-4745-b643-716099eccf12.81cf4546bb2d1972c3d14ea1d18fad57.jpeg?odnHeight=640&odnWidth=640&odnBg=FFFFFF	10.99	35	t	2025-11-27 12:49:09.718434	2025-11-27 12:49:09.718434
ebac5bf3-df53-44a5-90b1-fb4afd25fcb6	Cute pajama	Sleepwear	\N	https://img.freepik.com/premium-vector/pajama-con-clipart-avatar-logotype-isolated-vector-illustration_955346-90.jpg	100.00	-11	f	2025-11-30 01:11:48.021057	2025-11-30 01:38:52.809869
dea81793-2374-493a-9728-9efba52cabe2	Minimalist Pocket Tee	shirts	Soft cotton blend with a functional chest pocket.	https://example.com/images/shirt4.jpg	13.99	27	t	2025-11-27 12:49:09.718434	2025-11-27 12:49:09.718434
da73afa5-131f-40d9-b7b2-d7c75929460d	Striped Casual Tee	shirts	Striped pattern, classic fit, all-day comfort.	https://example.com/images/shirt5.jpg	11.50	21	t	2025-11-27 12:49:09.718434	2025-11-27 12:49:09.718434
e5ecaf77-eec9-4b2e-80cb-82f71a23ebfe	Performance Running Tee	shirts	Sweat-resistant, breathable mesh.	https://banditrunning.com/cdn/shop/files/summer-2024-ecom-_1971_1600x.jpg?v=1719867530	14.50	20	t	2025-11-27 12:49:09.718434	2025-11-27 12:49:09.718434
a82da774-6db1-455c-956f-f21173d9e2a3	Soft Modal Tee	shirts	Ultra-smooth modal fabric, breathable.	https://example.com/images/shirt11.jpg	15.99	29	t	2025-11-27 12:49:09.718434	2025-11-27 12:49:09.718434
694bb2fa-85d9-4d4f-af40-bde572d456f3	Long Sleeve Basic Tee	shirts	Lightweight long-sleeve for layering or stand-alone wear.	https://example.com/images/shirt6.jpg	16.00	17	t	2025-11-27 12:49:09.718434	2025-11-27 12:49:09.718434
96ffaa09-b70d-46e8-bfd6-c74141bc0845	Graphic Printed Tee	shirts	High-quality print, soft fabric, unisex style.	https://example.com/images/shirt7.jpg	14.25	33	t	2025-11-27 12:49:09.718434	2025-11-27 12:49:09.718434
e59fe56b-3572-44e9-9c57-4052d211b1a8	Athletic Dry-Fit Tee	shirts	Moisture-wicking fabric perfect for workouts.	https://example.com/images/shirt8.jpg	13.75	19	t	2025-11-27 12:49:09.718434	2025-11-27 12:49:09.718434
a143b15c-a774-48d6-8662-bc44f0170cb7	Cropped Casual Tee	shirts	Trendy cropped cut with soft stretch fabric.	https://example.com/images/shirt12.jpg	11.99	3	t	2025-11-27 12:49:09.718434	2025-11-27 12:49:09.718434
a5404e70-8d5a-41e4-ae84-99811ba5ba35	Everyday Comfort Tee	shirts	Versatile basic tee for casual wear.	https://i5.walmartimages.com/seo/CaiJunJia-George-Men-s-100-Cotton-Classic-T-Shirt-Everyday-Soft-Tee-For-Men-Comfortable-Men-s-T-Shirt-Big-Tall_8aec636d-cf70-41b6-aba1-06a31d9d369e.a2de151cf8595a9139b3baadc652657b.jpeg	12.00	40	t	2025-11-27 12:49:09.718434	2025-11-27 12:49:09.718434
379f2178-4a03-4894-b45a-f65b914fd45f	Heavyweight Boxy Tee	shirts	Thick premium cotton, boxy structure.	https://images.shirtspace.com/fullsize/w%2Fexa%2BShdxc8Jrj%2FqUJFYA%3D%3D/487428/23116-next-level-nl7610-ladies-heavyweight-boxy-t-shirt-front-black.jpg	17.99	9	t	2025-11-27 12:49:09.718434	2025-11-27 12:49:09.718434
3d11317d-669f-48ad-9efb-10f77083fbf1	Henley Button Tee	shirts	3-button front, modern casual fit.	https://example.com/images/shirt13.jpg	13.50	8	t	2025-11-27 12:49:09.718434	2025-11-27 12:49:09.718434
28ad5ac3-8d80-4258-b34a-22d20cebff27	Urban Logo Tee	shirts	Minimal logo front, trending fit.	https://example.com/images/shirt15.jpg	12.99	29	t	2025-11-27 12:49:09.718434	2025-11-27 12:49:09.718434
df8d33a1-3a3e-4ac1-a389-97555cf9098f	Premium Essential Tee	shirts	High-quality cotton with reinforced stitching.	https://example.com/images/shirt16.jpg	16.50	23	t	2025-11-27 12:49:09.718434	2025-11-27 12:49:09.718434
a2ad9e7f-3830-4c36-ac43-0cf07acd0869	Raglan Sleeve Tee	shirts	Contrast sleeves, athletic cut.	https://example.com/images/shirt17.jpg	12.75	27	t	2025-11-27 12:49:09.718434	2025-11-27 12:49:09.718434
13cbfd70-7f05-472c-a78b-d0c13563b31d	Classic Cotton Crewneck Tee	shirts	100% soft cotton, regular fit, breathable everyday wear.	https://example.com/images/shirt1.jpg	12.99	38	t	2025-11-27 12:49:09.718434	2025-11-27 12:49:09.718434
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (user_id, email, password_hash, role, created_at) FROM stdin;
87fa1654-5da7-4921-bf6d-0ed5fc68bcd2	salvaleon.stephanie@gmail.com	$2b$10$MJFXP04m9yLUpXgy4x7Pf.q7n8YylV/nuhAg9RgqRa.FugxZcMyvu	staff	2025-11-25 01:04:57.16277
bf251cf0-1fcb-4716-a22d-d88586538cba	jacquelinesalbaleon@gmail.com	$2b$10$GeCXQqwzm.T3YHGYuSz6k.hoXQZ2gdGbodQpb6474R3YPuTVLU9Vm	customer	2025-11-25 14:44:54.324812
c9926f7b-e39f-4115-a0d9-4b574565e21a	salvaleonstephanie15@gmail.com	$2b$10$lNDxNtiEnDlQDyGLppYVh.lDSv4JY00xK3EU.RDybfcWwbn5HGtZC	customer	2025-11-25 15:24:26.803637
d4850428-f836-41fd-840d-e42fbe4c9eb8	jacqsalva@gmail.com	$2b$10$yyO0L2EC057nuKXM90xcUOHorGXS7uMVrbRwscxT1e49Pk.0PWZIq	customer	2025-11-26 08:32:26.756171
df687731-4474-4798-bc50-02c7e1ec9ec2	stephsalvaleon@gmail.com	$2b$10$Ic88DHIA9TOErF0JnW/mg.8nSYDCjFCUDQ692gYR5t6liJBUMjAtm	customer	2025-11-26 08:49:26.222147
ebb7b27d-2c6f-4ee5-b9aa-6491af4fc7db	abcd@gmail.com	$2b$10$Ld0dcvnoFKo1UjgUY9D5guqttsLqHmxduViLcdZDUNCpB1WeiaK62	customer	2025-11-26 08:57:16.638211
f74180c3-3bcf-479f-9fe5-71167edad7ca	cbschsh@gmail.com	$2b$10$MDXOPesB3/57yQ94o3hHwuhpekWVkV7tSTqIMRQ1gOCKipUQfoiOC	customer	2025-11-26 09:01:25.415287
738ed0e3-a337-49ab-b176-5a092c333a43	feerfnergbrehu@gmail.com	$2b$10$KRVkY2mCErActLYiTJkUfu8/eMSWHJPhE.k0p8Tk8nNgXbUZlPwvK	customer	2025-11-26 09:07:56.948015
a53bb607-d3ea-429c-9eea-f0509ac50a67	djweofhe89@gmail.com	$2b$10$7KxPqX1sH0CpiX0vTmbzEOtvt1kJI5kjBOqBxnsufL11BMY7NdlLS	customer	2025-11-26 09:13:56.287679
20558e9b-94d7-406a-934c-62734789565e	scmdjsg@gmail.com	$2b$10$BipygS/rdmTXztjsSwAc/.fcMpmGTgkVFZE/GznpiNhfXGiIeRme6	customer	2025-11-26 09:27:45.430858
5f56e18f-427b-4e96-a269-2a02784fa709	dsfd@gmail.com	$2b$10$eCkgBCkXfUfHV0p536Mcpu0uho0DzMjWbsDgTHxM1bHKN/8xW9O96	customer	2025-11-26 10:01:52.688503
f568d048-5361-4047-91ae-02720e1c8d2e	sads@gmail.com	$2b$10$RmdIwTMOx02h.QDocTjh9u6EtZxGbuzkQnMAgwMU6JIYa0M91O06K	customer	2025-11-26 10:09:06.423055
65c42bc8-fd17-418c-a720-f06054377c5f	me@gmail.com	$2b$10$RfwQ9ute6DjtaTl5Dqf7DedxHpVLCvy0Y30B/1oE8zVmpqCnEMTQq	customer	2025-11-26 10:20:17.229578
1be116d9-391d-48c0-854c-3518285b50bb	ako@gmail.com	$2b$10$W3hcLztJ7syFJQnqQw5ZiOA.zjj8.5W6LyAE.UpmhOrKrv94D8CQK	customer	2025-11-26 10:23:03.212221
73b56b9f-e025-45fe-81ee-599a388a8c56	akoni@gmail.com	$2b$10$4.9X1H/5fGvvHwdXS/uuKe87KsCsrOjvnWPMabALCPo1zkNPwFx8W	customer	2025-11-26 13:42:49.212909
4fe300f7-3897-48b2-8472-b21d5c3b88fa	me123@gmail.com	$2b$10$Z8XsrQbBloEvRVvdA5hlOuuErQyoZugSTtXWBYjJCfX3AeaUtO4wK	customer	2025-11-26 13:56:48.441298
b12b1aa7-7c28-466b-bc1b-772ebe0fbbfb	nji@gmail.com	$2b$10$W4iAEZvvKRCZTaq43hiKg.r5KLh394SfhIC51F8vh9hKredXRZQLm	customer	2025-11-26 14:02:17.028079
c7f047e5-87e9-4d70-b29e-4bfb9f730aeb	KL@gmail.com	$2b$10$nu63lzGUWnKMIwEr5KyGoOgbXaLKWFutwhIDUwdANRvsfYGRrVmLS	customer	2025-11-26 14:35:58.504502
665dfaeb-54a1-4db6-a775-b6cc356d3f0b	dwasd@gmail.com	$2b$10$LY9YPcxfEYvSG2Z7kg6PTub.obBBcLq2eGfngCqvHJYu4VZ9kAR12	customer	2025-11-26 15:17:49.194954
d52aadab-c840-414d-83f9-cea4ea83373a	wqrf@gmail.com	$2b$10$P/bDoOw2WnOdNXN2q0P90ulno4Pmh33wiYXEmTPeoscL0wXnagXA2	customer	2025-11-26 16:06:55.461466
f3062bd2-15a7-4c29-8eab-f6fec8fa1993	xsad@gmail.com	$2b$10$/CxNFeaGcL8eI5kbMj9S0erAoXlGzyQotfHZnOPTbsfqJxyjEdGyC	customer	2025-11-26 16:10:40.528392
4489ecd5-b27f-4505-8c00-1afa5be8c717	jdhsjhd@gmail.com	$2b$10$hyquKkhF2Z67gjPbSP8y/.y1BcgDeCJ27eDsq296uXRe7wKnFKfRi	customer	2025-11-26 17:21:21.05036
42017061-4e28-423a-9ca6-18b155c71dc8	jean.ran@gmail.com	$2b$10$Thr2lmuMX4dkPiMWnUXIT.IJMPKkprdL.L8ks5dhRmHq.B7KGbGpy	customer	2025-11-28 17:10:56.548441
7a0732d5-5375-4fd4-aa1a-1551cff90949	ran.jean@gmail.com	$2b$10$p8f89epomQZLTF1DwIc0su.1Ob9un5qcWO7vOaEafiqxEYzcPRwca	customer	2025-11-28 17:58:05.285238
548e0cf2-e35b-465e-b470-46c57b2e51bf	salvaleon@gmail.com	$2b$10$E.SFxqLfaDWIJb4wNR/reuF1jf/fkvC65ItajSD/W7OB8H17r3xmy	customer	2025-11-28 18:08:46.602208
fbd191b7-ae12-4b28-ad94-57174c7722be	stephanie@gmail.com	$2b$10$30Nkrllyp4kVQs6FQP3.MOlEHgSjnJke8Id1jw/DSqZ.G439e7tEi	customer	2025-11-29 09:03:42.954468
38e76728-4068-4f84-8541-b87abc38286f	admin@gmail.com	$2b$10$/cRKudf/tmi4HBfwBWSvueF7X7vztM3U4w1PpeaGqR.Pvx71jplSO	admin	2025-11-29 14:21:02.073383
edec3850-1631-4896-9ce4-204c4fe97a04	ranoajeanalie@gmail.com	$2b$10$LuloWVR1wMb4uCt/lJQahuu/cH4rkDS0pn44bOk89jH.MFl9B2ehi	customer	2025-11-29 23:56:10.299976
cb8d28f4-e471-4d2a-9ae9-85974090e58b	sam@gmail.com	$2b$10$b0BQ01jkyhLzjnhWFZpQXuwhkou/se2rXdYfZ0JiHFrcNWn73oxpq	customer	2025-11-29 08:40:39.076263
f918e49f-2c5f-4aa5-900f-ca749aba0df5	salvaleon.stephanie15@gmail.com	$2b$10$Mr/3Zz8ntejt8Ect1i/so.5wW5Lyvj1b.8yjl7YKIE/8xWk3n/rPa	customer	2025-11-30 01:04:02.701679
\.


--
-- Name: customers customers_customer_id_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.customers
    ADD CONSTRAINT customers_customer_id_unique UNIQUE (customer_id);


--
-- Name: order_items order_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_pkey PRIMARY KEY (order_item_id);


--
-- Name: orders orders_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_pkey PRIMARY KEY (order_id);


--
-- Name: payments payments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_pkey PRIMARY KEY (payment_id);


--
-- Name: products products_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_pkey PRIMARY KEY (product_id);


--
-- Name: users unique_email; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT unique_email UNIQUE (email);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (user_id);


--
-- Name: customers customers_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.customers
    ADD CONSTRAINT customers_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE SET NULL;


--
-- Name: order_items order_items_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(order_id) ON DELETE CASCADE;


--
-- Name: orders orders_customer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.customers(customer_id) ON DELETE RESTRICT;


--
-- Name: payments payments_customer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.customers(customer_id) ON DELETE CASCADE;


--
-- Name: payments payments_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(order_id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict il83J4bpaO2ytAgfJ7uR02F9Y7pcIaN75pLgxpGcUv0usgK2cI8l8kqItLgvjN6

