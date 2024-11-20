PGDMP      	            
    |            fullstack2024_workshop    17.1    17.1 ?               0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                           false                       0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                           false                       0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                           false                       1262    16855    fullstack2024_workshop    DATABASE     �   CREATE DATABASE fullstack2024_workshop WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'English_United States.1252';
 &   DROP DATABASE fullstack2024_workshop;
                     postgres    false                        2615    2200    public    SCHEMA     2   -- *not* creating schema, since initdb creates it
 2   -- *not* dropping schema, since initdb creates it
                     postgres    false                       0    0    SCHEMA public    COMMENT         COMMENT ON SCHEMA public IS '';
                        postgres    false    5                       0    0    SCHEMA public    ACL     +   REVOKE USAGE ON SCHEMA public FROM PUBLIC;
                        postgres    false    5            �            1259    16856    Author    TABLE     R   CREATE TABLE public."Author" (
    id integer NOT NULL,
    name text NOT NULL
);
    DROP TABLE public."Author";
       public         heap r       postgres    false    5            �            1259    16861    Author_id_seq    SEQUENCE     �   CREATE SEQUENCE public."Author_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 &   DROP SEQUENCE public."Author_id_seq";
       public               postgres    false    5    217                       0    0    Author_id_seq    SEQUENCE OWNED BY     C   ALTER SEQUENCE public."Author_id_seq" OWNED BY public."Author".id;
          public               postgres    false    218            �            1259    16862    Category    TABLE     T   CREATE TABLE public."Category" (
    id integer NOT NULL,
    name text NOT NULL
);
    DROP TABLE public."Category";
       public         heap r       postgres    false    5            �            1259    16867    Category_id_seq    SEQUENCE     �   CREATE SEQUENCE public."Category_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 (   DROP SEQUENCE public."Category_id_seq";
       public               postgres    false    5    219                       0    0    Category_id_seq    SEQUENCE OWNED BY     G   ALTER SEQUENCE public."Category_id_seq" OWNED BY public."Category".id;
          public               postgres    false    220            �            1259    16868    Order    TABLE     �  CREATE TABLE public."Order" (
    id integer NOT NULL,
    "userId" integer NOT NULL,
    "orderTotal" integer,
    status text DEFAULT 'To be paid'::text NOT NULL,
    address text NOT NULL,
    "orderDate" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    phone text NOT NULL,
    "parcelCode" text,
    "paymentDate" timestamp(3) without time zone,
    "paymentSlipIMG" text,
    "statusDetail" text DEFAULT 'Please complete the payment and confirm the payment'::text
);
    DROP TABLE public."Order";
       public         heap r       postgres    false    5            �            1259    16875    Order_id_seq    SEQUENCE     �   CREATE SEQUENCE public."Order_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 %   DROP SEQUENCE public."Order_id_seq";
       public               postgres    false    5    221                       0    0    Order_id_seq    SEQUENCE OWNED BY     A   ALTER SEQUENCE public."Order_id_seq" OWNED BY public."Order".id;
          public               postgres    false    222            �            1259    16876    Product    TABLE     N  CREATE TABLE public."Product" (
    id integer NOT NULL,
    name text NOT NULL,
    cost integer NOT NULL,
    price integer NOT NULL,
    img text DEFAULT 'noIMGFile'::text NOT NULL,
    status text DEFAULT 'use'::text NOT NULL,
    "authorId" integer DEFAULT 1 NOT NULL,
    "desc" text,
    quantity integer DEFAULT 0 NOT NULL
);
    DROP TABLE public."Product";
       public         heap r       postgres    false    5            �            1259    16885    ProductCategory    TABLE     y   CREATE TABLE public."ProductCategory" (
    "productId" integer NOT NULL,
    "categoryId" integer DEFAULT 1 NOT NULL
);
 %   DROP TABLE public."ProductCategory";
       public         heap r       postgres    false    5            �            1259    16889    ProductOnCart    TABLE     �   CREATE TABLE public."ProductOnCart" (
    "userId" integer NOT NULL,
    "productId" integer NOT NULL,
    quantity integer DEFAULT 1 NOT NULL
);
 #   DROP TABLE public."ProductOnCart";
       public         heap r       postgres    false    5            �            1259    16893    ProductOnOrder    TABLE     �   CREATE TABLE public."ProductOnOrder" (
    "orderId" integer NOT NULL,
    "productId" integer NOT NULL,
    quantity integer DEFAULT 1 NOT NULL,
    "productPrice" integer NOT NULL
);
 $   DROP TABLE public."ProductOnOrder";
       public         heap r       postgres    false    5            �            1259    16897    Product_id_seq    SEQUENCE     �   CREATE SEQUENCE public."Product_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 '   DROP SEQUENCE public."Product_id_seq";
       public               postgres    false    223    5                        0    0    Product_id_seq    SEQUENCE OWNED BY     E   ALTER SEQUENCE public."Product_id_seq" OWNED BY public."Product".id;
          public               postgres    false    227            �            1259    16898    User    TABLE     �  CREATE TABLE public."User" (
    id integer NOT NULL,
    name text NOT NULL,
    status text DEFAULT 'use'::text NOT NULL,
    address text,
    "cartQty" integer DEFAULT 0 NOT NULL,
    "cartTotal" integer DEFAULT 0 NOT NULL,
    password text NOT NULL,
    role text DEFAULT 'client'::text NOT NULL,
    username text NOT NULL,
    phone text,
    profile text DEFAULT 'noIMGFile'::text NOT NULL
);
    DROP TABLE public."User";
       public         heap r       postgres    false    5            �            1259    16908    User_id_seq    SEQUENCE     �   CREATE SEQUENCE public."User_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 $   DROP SEQUENCE public."User_id_seq";
       public               postgres    false    5    228            !           0    0    User_id_seq    SEQUENCE OWNED BY     ?   ALTER SEQUENCE public."User_id_seq" OWNED BY public."User".id;
          public               postgres    false    229            �            1259    16909    _prisma_migrations    TABLE     �  CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);
 &   DROP TABLE public._prisma_migrations;
       public         heap r       postgres    false    5            E           2604    16916 	   Author id    DEFAULT     j   ALTER TABLE ONLY public."Author" ALTER COLUMN id SET DEFAULT nextval('public."Author_id_seq"'::regclass);
 :   ALTER TABLE public."Author" ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    218    217            F           2604    16917    Category id    DEFAULT     n   ALTER TABLE ONLY public."Category" ALTER COLUMN id SET DEFAULT nextval('public."Category_id_seq"'::regclass);
 <   ALTER TABLE public."Category" ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    220    219            G           2604    16918    Order id    DEFAULT     h   ALTER TABLE ONLY public."Order" ALTER COLUMN id SET DEFAULT nextval('public."Order_id_seq"'::regclass);
 9   ALTER TABLE public."Order" ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    222    221            K           2604    16919 
   Product id    DEFAULT     l   ALTER TABLE ONLY public."Product" ALTER COLUMN id SET DEFAULT nextval('public."Product_id_seq"'::regclass);
 ;   ALTER TABLE public."Product" ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    227    223            S           2604    16920    User id    DEFAULT     f   ALTER TABLE ONLY public."User" ALTER COLUMN id SET DEFAULT nextval('public."User_id_seq"'::regclass);
 8   ALTER TABLE public."User" ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    229    228                      0    16856    Author 
   TABLE DATA           ,   COPY public."Author" (id, name) FROM stdin;
    public               postgres    false    217   �M       	          0    16862    Category 
   TABLE DATA           .   COPY public."Category" (id, name) FROM stdin;
    public               postgres    false    219   'N                 0    16868    Order 
   TABLE DATA           �   COPY public."Order" (id, "userId", "orderTotal", status, address, "orderDate", phone, "parcelCode", "paymentDate", "paymentSlipIMG", "statusDetail") FROM stdin;
    public               postgres    false    221   �N                 0    16876    Product 
   TABLE DATA           e   COPY public."Product" (id, name, cost, price, img, status, "authorId", "desc", quantity) FROM stdin;
    public               postgres    false    223   �O                 0    16885    ProductCategory 
   TABLE DATA           F   COPY public."ProductCategory" ("productId", "categoryId") FROM stdin;
    public               postgres    false    224   �Q                 0    16889    ProductOnCart 
   TABLE DATA           J   COPY public."ProductOnCart" ("userId", "productId", quantity) FROM stdin;
    public               postgres    false    225   GR                 0    16893    ProductOnOrder 
   TABLE DATA           \   COPY public."ProductOnOrder" ("orderId", "productId", quantity, "productPrice") FROM stdin;
    public               postgres    false    226   dR                 0    16898    User 
   TABLE DATA           }   COPY public."User" (id, name, status, address, "cartQty", "cartTotal", password, role, username, phone, profile) FROM stdin;
    public               postgres    false    228   �R                 0    16909    _prisma_migrations 
   TABLE DATA           �   COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
    public               postgres    false    230   US       "           0    0    Author_id_seq    SEQUENCE SET     =   SELECT pg_catalog.setval('public."Author_id_seq"', 6, true);
          public               postgres    false    218            #           0    0    Category_id_seq    SEQUENCE SET     ?   SELECT pg_catalog.setval('public."Category_id_seq"', 9, true);
          public               postgres    false    220            $           0    0    Order_id_seq    SEQUENCE SET     <   SELECT pg_catalog.setval('public."Order_id_seq"', 2, true);
          public               postgres    false    222            %           0    0    Product_id_seq    SEQUENCE SET     ?   SELECT pg_catalog.setval('public."Product_id_seq"', 24, true);
          public               postgres    false    227            &           0    0    User_id_seq    SEQUENCE SET     ;   SELECT pg_catalog.setval('public."User_id_seq"', 4, true);
          public               postgres    false    229            \           2606    16922    Author Author_pkey 
   CONSTRAINT     T   ALTER TABLE ONLY public."Author"
    ADD CONSTRAINT "Author_pkey" PRIMARY KEY (id);
 @   ALTER TABLE ONLY public."Author" DROP CONSTRAINT "Author_pkey";
       public                 postgres    false    217            ^           2606    16924    Category Category_pkey 
   CONSTRAINT     X   ALTER TABLE ONLY public."Category"
    ADD CONSTRAINT "Category_pkey" PRIMARY KEY (id);
 D   ALTER TABLE ONLY public."Category" DROP CONSTRAINT "Category_pkey";
       public                 postgres    false    219            `           2606    16926    Order Order_pkey 
   CONSTRAINT     R   ALTER TABLE ONLY public."Order"
    ADD CONSTRAINT "Order_pkey" PRIMARY KEY (id);
 >   ALTER TABLE ONLY public."Order" DROP CONSTRAINT "Order_pkey";
       public                 postgres    false    221            d           2606    16928 $   ProductCategory ProductCategory_pkey 
   CONSTRAINT     }   ALTER TABLE ONLY public."ProductCategory"
    ADD CONSTRAINT "ProductCategory_pkey" PRIMARY KEY ("productId", "categoryId");
 R   ALTER TABLE ONLY public."ProductCategory" DROP CONSTRAINT "ProductCategory_pkey";
       public                 postgres    false    224    224            f           2606    16930     ProductOnCart ProductOnCart_pkey 
   CONSTRAINT     u   ALTER TABLE ONLY public."ProductOnCart"
    ADD CONSTRAINT "ProductOnCart_pkey" PRIMARY KEY ("userId", "productId");
 N   ALTER TABLE ONLY public."ProductOnCart" DROP CONSTRAINT "ProductOnCart_pkey";
       public                 postgres    false    225    225            h           2606    16932 "   ProductOnOrder ProductOnOrder_pkey 
   CONSTRAINT     x   ALTER TABLE ONLY public."ProductOnOrder"
    ADD CONSTRAINT "ProductOnOrder_pkey" PRIMARY KEY ("orderId", "productId");
 P   ALTER TABLE ONLY public."ProductOnOrder" DROP CONSTRAINT "ProductOnOrder_pkey";
       public                 postgres    false    226    226            b           2606    16934    Product Product_pkey 
   CONSTRAINT     V   ALTER TABLE ONLY public."Product"
    ADD CONSTRAINT "Product_pkey" PRIMARY KEY (id);
 B   ALTER TABLE ONLY public."Product" DROP CONSTRAINT "Product_pkey";
       public                 postgres    false    223            j           2606    16936    User User_pkey 
   CONSTRAINT     P   ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);
 <   ALTER TABLE ONLY public."User" DROP CONSTRAINT "User_pkey";
       public                 postgres    false    228            m           2606    16938 *   _prisma_migrations _prisma_migrations_pkey 
   CONSTRAINT     h   ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);
 T   ALTER TABLE ONLY public._prisma_migrations DROP CONSTRAINT _prisma_migrations_pkey;
       public                 postgres    false    230            k           1259    16939    User_username_key    INDEX     Q   CREATE UNIQUE INDEX "User_username_key" ON public."User" USING btree (username);
 '   DROP INDEX public."User_username_key";
       public                 postgres    false    228            n           2606    16940    Order Order_userId_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."Order"
    ADD CONSTRAINT "Order_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;
 E   ALTER TABLE ONLY public."Order" DROP CONSTRAINT "Order_userId_fkey";
       public               postgres    false    228    221    4714            p           2606    16945 /   ProductCategory ProductCategory_categoryId_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."ProductCategory"
    ADD CONSTRAINT "ProductCategory_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES public."Category"(id) ON UPDATE CASCADE ON DELETE RESTRICT;
 ]   ALTER TABLE ONLY public."ProductCategory" DROP CONSTRAINT "ProductCategory_categoryId_fkey";
       public               postgres    false    4702    219    224            q           2606    16950 .   ProductCategory ProductCategory_productId_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."ProductCategory"
    ADD CONSTRAINT "ProductCategory_productId_fkey" FOREIGN KEY ("productId") REFERENCES public."Product"(id) ON UPDATE CASCADE ON DELETE RESTRICT;
 \   ALTER TABLE ONLY public."ProductCategory" DROP CONSTRAINT "ProductCategory_productId_fkey";
       public               postgres    false    224    4706    223            r           2606    16955 *   ProductOnCart ProductOnCart_productId_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."ProductOnCart"
    ADD CONSTRAINT "ProductOnCart_productId_fkey" FOREIGN KEY ("productId") REFERENCES public."Product"(id) ON UPDATE CASCADE ON DELETE RESTRICT;
 X   ALTER TABLE ONLY public."ProductOnCart" DROP CONSTRAINT "ProductOnCart_productId_fkey";
       public               postgres    false    223    225    4706            s           2606    16960 '   ProductOnCart ProductOnCart_userId_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."ProductOnCart"
    ADD CONSTRAINT "ProductOnCart_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;
 U   ALTER TABLE ONLY public."ProductOnCart" DROP CONSTRAINT "ProductOnCart_userId_fkey";
       public               postgres    false    4714    228    225            t           2606    16965 *   ProductOnOrder ProductOnOrder_orderId_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."ProductOnOrder"
    ADD CONSTRAINT "ProductOnOrder_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES public."Order"(id) ON UPDATE CASCADE ON DELETE RESTRICT;
 X   ALTER TABLE ONLY public."ProductOnOrder" DROP CONSTRAINT "ProductOnOrder_orderId_fkey";
       public               postgres    false    226    4704    221            u           2606    16970 ,   ProductOnOrder ProductOnOrder_productId_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."ProductOnOrder"
    ADD CONSTRAINT "ProductOnOrder_productId_fkey" FOREIGN KEY ("productId") REFERENCES public."Product"(id) ON UPDATE CASCADE ON DELETE RESTRICT;
 Z   ALTER TABLE ONLY public."ProductOnOrder" DROP CONSTRAINT "ProductOnOrder_productId_fkey";
       public               postgres    false    4706    226    223            o           2606    16975    Product Product_authorId_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."Product"
    ADD CONSTRAINT "Product_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES public."Author"(id) ON UPDATE CASCADE ON DELETE RESTRICT;
 K   ALTER TABLE ONLY public."Product" DROP CONSTRAINT "Product_authorId_fkey";
       public               postgres    false    223    4700    217               5   x�3�����/��2������2R�\&�.��\��i)�)\f�N�y\1z\\\ 3y�      	   ]   x�3��/�H-*�2�t)J�M�2���M�+�L�2�t���M�2�t��MM��2�N��M��2�.)
XpdTg&sYr�u��r��qqq _:           x����N1��ݧ� �̲t�G=�ً�� �4�tS����r7����|АA$2}����agVc��[�>n��è��N��ºS����AWO�'k��|�8ŶЮq�����ؖ��T/Ȭ�?�x~���p��_ɗ�h�]t���WdjӖ��9���i�8bR�9�3��3����-��1V���)���'�b�+���4�Iah�l����T,�?p8��k=����f�X4�|��H��o�zVU�'Ey�         (  x�m�ͮ�0��㧸��"ϟe�E�.�ݤ�bJ��UQ��ﱉ(I�d"���3�h��(�
�]�}�����J�W��9�Yh�]���ɓ�C$S�Jn���@4A���9٭9)FO���r�8�Hܗ����l���}!<��1To�FZ������"��7*�%���V��铥�����[O��۩5n݃�(��-7ʬ]��=�,)N����s����w�y�nn�7�G��\q�:����3\��<ßZYw�=uu�v�B�H)H\�:!��b����F����N¡[K��6�9Ugvl׉��͑��fx̗y:��4�TL��ղ�f��;�~�nA���؏�X��-������(6_&0>�4�c�G���Mj����q�.���.�׹�̛[e�
�l�^/XS޸u�>_�@+�0����m��,q/��r�U+�Ea�(6|$u�aV1����X(]�bV�cUۭQ���%h��4b�S�%���VNWN5��յ�\1[=������E��t��ƨ�8���4F�         X   x�M��@zK1�Eݫ��_G @���p��	Ҫ������v[]e9b�'&�TMj������"uձM�tA|C�~Rj��)���{U            x������ � �         0   x�3�4�4�44�S�F@�1YF���&���@�1P$���� �"�         �   x�U��
�0���ǔ�&}m�Dt㶛KmL�[��U�����7<'������rT����J�eUo��E�r�m�Є/L^ �B�!Ћfz$޵LE.?u���]�r�r��"UY
n<�{�k&#���f"��q�K����G�	c�5�D�         �  x�}��N\9�?O�﫠8�������i���������
�������q
�kմJ��.�����
�Ѫ0�a �9�).�3�T��3i�ڑ*�^��Y��Uk�Y%L 	�S.WW9_
3�+���܊@EA����t޾����<>���y 	5��l��xք9S�J"�%TMW�Ł
���{�����l��,�<E
�,�ר�x��g�]���rn@ 9o�l���۹��q��cf�g���m$������2���P!cj��r��*:ECKG6--�\�GS���x b4�xr�wp(�/�� �+>҄0����ϧ��p��`�ғ�p�D�Mb��� L�8�I��K[��!������}M�kս~��cC̩9d�b��0��*��/m ��, �<�~��o篾�����	�h�КF�P|
פI�]n�ˁ��}�ڨW�ŕk�e�P@���8�t�ͻӜM�U��$:�)a�� PK��ͯ��ˋ���p�z<m׶}����7��n�����ݿw��w�j�lAk�.��E�	�G0�Is랛����,�۝i.�� a]\�pV_s��28<�:5!D����Q޶�Bey[B7D�	;�ٿO?v����˯�@�9�Q��3����fO�Jp$��:�84�?�yJ���{�pe7g�2Tg_N� Eh��1j�NT��b���?�����ۺ������q��V��H��h���ᔙ	�(GA��e�"����Q����Bk�*u��4\[BQ��r'�w��H��������O�Z����Vp�'��}��7#G���f*�
��t0)a���g�C[��k�ª���ȶ��x�fc���oMD�H��H�UI�����H�9nǓ��]��,@��04S�a*��jI!���y��#�0�<q��jI�$k,SS���V�Y[+"p�F���Ǣԡ����U�||�t�0c�WD1g�HX,�}b���~w����ɕ[~��	u�Dy�7L��j2��s��=�~�����*�lDGx�}7k�P\<�MJ���.W���D��D���z�7/cWEL����7���v���=�_�1ʳ�{�2���������}���>P\�$.q-Zs�Pq���Nt��`I���9׸�D��Q^�(�����.K�Ax���b{��G��k��ܯo� ��(�~�'�ϗ��z�J     