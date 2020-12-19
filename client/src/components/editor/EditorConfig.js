import Essentials from "@ckeditor/ckeditor5-essentials/src/essentials";

import Paragraph from "@ckeditor/ckeditor5-paragraph/src/paragraph";

import Bold from "@ckeditor/ckeditor5-basic-styles/src/bold";

import Italic from "@ckeditor/ckeditor5-basic-styles/src/italic";

import Underline from "@ckeditor/ckeditor5-basic-styles/src/underline";

import Strikethrough from "@ckeditor/ckeditor5-basic-styles/src/strikethrough";

import Code from "@ckeditor/ckeditor5-basic-styles/src/code";

import BlockQuote from "@ckeditor/ckeditor5-block-quote/src/blockquote";

import Link from "@ckeditor/ckeditor5-link/src/link";

import MediaEmbed from "@ckeditor/ckeditor5-media-embed/src/mediaembed";

import PasteFromOffice from "@ckeditor/ckeditor5-paste-from-office/src/pastefromoffice";

import Heading from "@ckeditor/ckeditor5-heading/src/heading";

import Font from "@ckeditor/ckeditor5-font/src/font";

import Image from "@ckeditor/ckeditor5-image/src/image";

import ImageStyle from "@ckeditor/ckeditor5-image/src/imagestyle";

import ImageToolbar from "@ckeditor/ckeditor5-image/src/imagetoolbar";

import ImageUpload from "@ckeditor/ckeditor5-image/src/imageupload";

import ImageResize from "@ckeditor/ckeditor5-image/src/imageresize";

import List from "@ckeditor/ckeditor5-list/src/list";

import Alignment from "@ckeditor/ckeditor5-alignment/src/alignment";

import Table from "@ckeditor/ckeditor5-table/src/table";

import TableToolbar from "@ckeditor/ckeditor5-table/src/tabletoolbar";

import TextTransformation from "@ckeditor/ckeditor5-typing/src/texttransformation";

import Indent from "@ckeditor/ckeditor5-indent/src/indent";

import IndentBlock from "@ckeditor/ckeditor5-indent/src/indentblock";

/* import Base64UploadAdapter from "@ckeditor/ckeditor5-upload/src/adapters/base64uploadadapter"; */

import SimpleUploadAdapter from "@ckeditor/ckeditor5-upload/src/adapters/simpleuploadadapter";

import "@ckeditor/ckeditor5-build-classic/build/translations/ko";

import dotenv from "dotenv";

dotenv.config();

export const editorConfiguration = {
    plugins: [
        Essentials,

        Paragraph,

        Bold,

        Code,

        Italic,

        Heading,

        Indent,

        IndentBlock,

        Underline,

        Strikethrough,

        BlockQuote,

        Font,

        Alignment,

        List,

        Link,

        MediaEmbed,

        PasteFromOffice,

        Image,

        ImageStyle,

        ImageToolbar,

        ImageUpload,

        ImageResize,

        SimpleUploadAdapter,

        Table,

        TableToolbar,

        TextTransformation,
    ],

    toolbar: [
        "heading",

        "|",

        "bold",

        "italic",

        "underline",

        "strikethrough",

        "code",

        "|",

        "fontSize",

        "fontColor",

        "fontBackgroundColor",

        "|",

        "alignment",

        "outdent",

        "indent",

        "bulletedList",

        "numberedList",

        "blockQuote",

        "|",

        "link",

        "insertTable",

        "imageUpload",

        "mediaEmbed",

        "|",

        "undo",

        "redo",
    ],

    heading: {
        options: [
            {
                model: "paragraph",

                view: "p",

                title: "본문",

                class: "ck-heading_paragraph",
            },

            {
                model: "heading1",

                view: "h1",

                title: "헤더1",

                class: "ck-heading_heading1",
            },

            {
                model: "heading2",

                view: "h2",

                title: "헤더2",

                class: "ck-heading_heading2",
            },

            {
                model: "heading3",

                view: "h3",

                title: "헤더3",

                class: "ck-heading_heading3",
            },
        ],
    },

    fontSize: {
        options: [
            9,

            10,

            11,

            12,

            13,

            14,

            15,

            16,

            17,

            18,

            19,

            20,

            21,

            23,

            25,

            27,

            29,

            31,

            33,

            35,
        ],
    },

    alignment: {
        options: ["justify", "left", "center", "right"],
    },

    table: {
        contentToolbar: ["tableColumn", "tableRow", "mergeTableCells"],
    },

    image: {
        resizeUnit: "px",

        toolbar: [
            "imageStyle:alignLeft",

            "imageStyle:full",

            "imageStyle:alignRight",

            "|",

            "imageTextAlternative",
        ],

        styles: ["full", "alignLeft", "alignRight"],
    },

    typing: {
        transformations: {
            remove: [
                "enDash",

                "emDash",

                "oneHalf",

                "oneThird",

                "twoThirds",

                "oneForth",

                "threeQuarters",
            ],
        },
    },

    language: "ko",

    // ! 이 부분은 중요
    // 동시 사용자 5명까지는 무료, 동시에 25명 이상이 작성하면 값이 들어감
    // CKEditor 5 doc의 Deep dive에서 custom upload adapter
    simpleUpload: {
        // ! 이미지를 클릭해서 넣거나 드래그 해서 이미지를 업로드 하는 부분
        /**그림 파일 업로드
         * * 만약 AWS를 통해서 블로그를 실제로 서비스를 진행한다는 가정하에
         * * 그림 파일 업로드를 하면
         * * 해당 파일이 AWS 에스쓰리?에서 저장이 되고
         * * 저장된 후에 그 파일이 저장되어 있는 주소를 반환을 받아서 front에서 보여지는 것
         */
        // * 현재 url은 개발서버로 작성이 되어있고
        // 나중에 배포를 한다면 env의 변수값을 변경해준다.
        uploadUrl: `${process.env.REACT_APP_BASIC_SERVER_URL}/api/posts/image`,
        // TODO 서버쪽에 이미지 업로드 관련 router를 만들고
        // TODO 다시 client로 와서 관련 adapter를 만들 예정

        // Headers sent along with the XMLHttpRequest to the upload server.

        headers: {
            "X-CSRF-TOKEN": "CSFR-Token",
        },
    },
};

export const ReadOnly_Configuration = {
    toolbar: ["heading"],

    heading: {},
};
