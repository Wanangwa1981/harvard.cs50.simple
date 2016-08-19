define(function(require, exports, module) {
    "use strict";

    main.consumes = [
        "ace", "ace.status", "auth", "c9", "clipboard", "commands", "console",
        "Divider", "harvard.cs50.presentation", "immediate", "info",  "keymaps",
        "layout", "login", "Menu", "menus", "panels", "Plugin", "preferences",
        "preview", "run.gui", "save", "settings", "tabManager", "terminal",
        "tooltip", "tree", "ui", "util"
    ];
    main.provides = ["c9.ide.cs50.simple"];
    return main;

    function main(options, imports, register) {
        var auth = imports.auth;
        var c9 = imports.c9;
        var commands = imports.commands;
        var info = imports.info;
        var layout = imports.layout;
        var menus = imports.menus;
        var panels = imports.panels;
        var Plugin = imports.Plugin;
        var prefs = imports.preferences;
        var presentation = imports["harvard.cs50.presentation"];
        var settings = imports.settings;
        var tabs = imports.tabManager;
        var tabManager = imports.tabManager;
        var tree = imports.tree;
        var ui = imports.ui;

        var plugin = new Plugin("CS50", main.consumes);

        var SETTINGS_VER = 9;
        var terminalSound = "data:audio/mp3;base64,SUQzAgAAAAAQPFRUMgAACQBib29wMiAxAENPTQAAEABlbmdpVHVuUEdBUAAwAABURU4AABEAaVR1bmVzIDEyLjQuMi40AENPTQAAaABlbmdpVHVuTk9STQAgMDAwMDAxMUUgMDAwMDAxMUIgMDAwMDA3MDkgMDAwMDA3MDkgMDAwMDAwNEUgMDAwMDAwNEUgMDAwMDI0M0QgMDAwMDI0MjYgMDAwMDAwMzQgMDAwMDAwMzQAQ09NAACCAGVuZ2lUdW5TTVBCACAwMDAwMDAwMCAwMDAwMDIxMCAwMDAwMDg0OCAwMDAwMDAwMDAwMDA0NkE4IDAwMDAwMDAwIDAwMDAyOEQxIDAwMDAwMDAwIDAwMDAwMDAwIDAwMDAwMDAwIDAwMDAwMDAwIDAwMDAwMDAwIDAwMDAwMDAwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//viAAAAB4KPOgEpY3LOUedwGMxuX9pA9AOljcNrSB8AlKW4BAAgYYhbfgsFCRAqK270jJ9tHK3qN/VGM0gcFCS7IwTFbaMkUChIujRkbyMEwTAGBsNisjJ8Rk6Mlg3Ec/z8qvudn7R5fFidWcRL7Gb+Uw4JhgeNkt4kCQoOzM/Ub9FixY5T2Ir/0sVJChtoQAaExyaUhEMt5PXcTn8FbHER2IixZC/jBxEsMCZV+/yvPHDgSHGHGHGKnZLMz/FiwSzMlk+zl169xhxu1TM//b5p3GxX18dJbfYqvJBYhP0h42+dkyEzEs/XiGWzsSFhgeVO36T9GzM/M38WCWTzN9hYcMiWIhhFdevXvzeAQAIAcLGj9cnTgMLJhYAABCIiCCEFkyZOzwGFq7nk02IZB6e3bRFsQITZgAQMjGMIOT0wABEU36Tdf7B517LH/6aUWLHF5nGscOz+2uTAYOU36adn68zP73+973uvXr7L7tr46Nma9Y51OXv5zDlTs/tU7P1hg4wYCQIAECxTcpjCw4WP3+Zzm15gYHlV6+69+t219ljnXWLNXr7LFix/5mAwPOmc0liWftmavb4sc1e/fW17+MLKZfNXtGDlKY5q/5293Kdt73+ZnFnNv53ecHiwwUDyZAKiKA8fcPFARCEIxSFQ7UKCCh9lkXHSmkxejZgvYTDgOGTpoWoLCAMdgJmEz6zBEuQNpItbYHMNFiI9a4lHh+rQyQyayhRGwgFNSICdTUhQ3pEnEpxszULQmlUX0IqFxSWbXXHZRfTU45Ttb50cqCC7AT5PeYK6wST0+iqsLF2WjdOfPnJVMVhXZjX42YnReTp3tfJdCeXlhbSlpRGd6J5+cozhXYcFXXfJwpJ6HU8s2WLFV1pYwofRGmNwnh6UWBEOWienP5MSTip0mk9aVTvsXYPitK/hteIvj++YFJ1QanaLocfOyeSENYgCk8NVp6ida8+eWl5CXPOLikuSZSICp4f2E9VmtFYgQtYctEoqm2qiuE2kTJVgqit1vhj5bZC0RTZRwI1moKgoKzibPjFLECNRsiG3KkQrXeQzgSWuqykfRITKJp0XEQgMm+imSnXzMNSbLRteCFOZIURbCaJGKdEhZSzTj2vKrN2hNIyM9WLiVpSCzYltmjxi6YQqNItHyJJndsuugWfYuVtNAc9pwbITpIjNNlpsQZTUXOoYo0SFVJojitUhU0VNiiSBCRoIG5QPTm0yocI2VS4eTI1oTdMxSBNBFhdKcXIEyE6i2ccF7eTDKJQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP/74gAAAAd/kD2BKWNw3hIHwBkpbhxeQPgEpS3Dc0gfAGSluE0mSozMZLDhlcQQ0bFAaIS8GA2qmiIkD4Htw4w86yaFLS5GUeZs+0kXsZPzXGZrHcPRKm04SrZ06UrThOTGFhg/Sx4JDZ2ZHpupheHI9JbElROfbZ5hIU+qf3GROXXSIaZ586cWF1EdsYkxa6tX0beQjjHl6dOuYOCFCYoobtp19Upg6tPVcZgf2o28nd5bdGe0SrlZ5CvfPUJAOHzkvWYVmDaZSpibWejaXs1eseK11eukTHkB2khbWaoPOq1XacZmFHDBxSarSwrfMSmmLtT5cqYTIQ4FtCbdPzYQ2WjuqUe1q94nqC/DCW3mE2pNVn42nAjQxIs4HJGjqxVAYlZyarYorgdjJOgMquLZAmLk7UiWeLHYjhxCcuiMC0ROMH3JikkQNihtsgvW6SPECngKjTKyCidERjBdIjkwVpEK7bfEoMNaQoG0j1mULJZZcqRFTZc9Mv4JH2biwc09JseJl2pFF4kaxjGl122i+oBpAdhRUXPrMXa6oELiTTBET9ZFGBUgXij5sabN829A1F7kB40ZMnFlYLkas0fUifXTsubKnspRkj87WaOPLi8ajkF3B4jbNNNqhpBiibBw1pKQLMkhGR9DlKo4xLzJ32gOI0hAhGQssNiQz2DKJEWIpCbtim6bmjbQPamQHcJ0jLBhtdqoDk4bLRos1Z2YHl1kmWmCyFtdVGZR9RAocPMMjMIlRoqRMyGB0hFS8SPCUfMI1Jn6YaFQnImiTYEKaBrCQNhVVBNioiZtJtl60iclZSeyVMljE0DaVKmxe4wKozcid8GlpzQyWbgaRoSNg6xiOSNyjzcBZAiIiZUumjbLICYw03jBAWRJ6RrpsYZI9Y6O0ip/oyReiDAq3TDIqFSAzZmbkkFzRC6dnGjA4s8yrqp8nKRN0Qp7MhYQQaBc4o5hE8GHOkgYgDkyzcFCZNY1Jckehf0RGRkxIbJidWbDKMYPtS0qWycRx+KGFFGzxRVEaWVNMRMICNUDbadQVVITz23zJBRMiFZWRdhoiRQssGCCGkCVBdVIkgTLA8ibJkCwfLqVFEmyWaN1AvhWLTGH1mCIgSa1rUyt9AqqjrSkjg6httddOSg2DMKgYZwxskahAo1ClqYOC22VE7CSK388Rz7SNI22xaTD9E5ObYTQwpC48JSWbVzkwInKsL2pjOsrh7kWRaIERpJOvPS4kk0Hg3OFD7E2yJHJHd2jLzAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD/++IAAAAHdJA9gSlLcPAyB7AlLG4cNkD4BiUtw4vIHwCUpbgHD8sI0aFNsZRzM0gFjya+FjTZE8GlUKEoIWYExYKxHUgwJBz2W02h5gyRhefoaqBDpFGaIwRDQJFGicaQvbEMyGa+HrPkyQlwnIoOISwmBIjRh5kmzkiMYJFBBRApAMRQKi67AxzYkclpD12XYsqPZKFMoSIGwMnmM51x14NBtdCwYOeRADtonhBskkUSIBpNTh6lyjNgMFoz1YxEHVXGzWkpc+KCw6RE6yMqmDYmYOHDbcBFMucEsQsSzLrkYXD5YnbkQPAQuoOnDQWmEUQlJICuRZ0DQoJVFxOxRdAK3G1Zo6YXRxKC1PwlLnhxVNGibNGyM9McR0TNzRo27UJwksjIoAqCSM8Fycbs4VI2Yt4qZPIp1JQQHyEbedGBAF0kR1owOu1hYd4zE0PbCt4wZQ0ya8by87W3JyD8JiyeYsZWHp+2Px0/yhDfhEwpr0yHZklNeVVitCoirxieRDbySsJBKMjUc6lol0PHHD0urXXy5GYHR6woPSsdJusts3gjJzByJRYzispRHFl49JTo+Wu2SUY2AiLYGTNesY+T2609SUbMpOioXlNTOh8nxKYtq6VMF9mXcMXUh4uecKl4XnGEMSEi4mvuWWUZWPJNS4y89T561Vi8rsHXP3YUcgC4OB7D8vaU1BPfOT8vNvS4qKIW6FTczZWDBIkuqSNo8O3ijJECUXlF1VFaWuVr7GBHEwKY7Y88zZyzCFYwdpsgbXVRKJAhAViRlLGW0awONqk0qeTIyGTZUlCKcShMqiJqpQnbXSh01DgrZFDKSMnNVpC9aaywLYycdqN6GagvQhQUUIUmJExoHTk+2sxJEwRjyKHgYQoMMD300TigwiEA4wRUTGliVBe4KSkFhGaR6wxGLTFaT6+yI8rhbU3ml0+SE5EthkkkPxGiE4pjEmGvjVlJkbzSKUBQlihpZlvFCVk+KAFAcKDgyiAOiDAniJeyxJUIkZde0AaFcXDpCtMu0sTzWTFoiNuLJecGXcfQMOSYIJn5L9HIhSZmnEqDFn10my7KiNUQLKDDwTJIMMFlptyKExUgYTIBMF9qA0eKSgSrKNtrMIkSBC609E7Vkl8EiJRklXVsw1yYtiqFknchQnXuNJqp4gFbcEhUsRwMigMEwIMJS7S7l0cSVpdbHF1CDrTbZonhg1C7K7okVjDJS6xKjIkzC0h7LSZOkSpE4iXYYmha6jJWCaLKICz1IoD5tASrG1XljxtQ88uZmTSEE06QgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//viAAAAB3mQPwVp4ADscefgrTwAXWZBH1lqgAP/SCNjLVAAPEiCwRlKkVFnNMCLQDpJLqL2MNcBl8BtPuQGjUOQgvBcwFwuJfDcPJlNM54872Z88+oLqSC3UhR1u7NDm1CeMcCTe6zMyqc4M8KJH1SNGYYcd/NdvbvLiO11vi+KNzleDA7yZ42Ob2Sjc8lf5jvYNqR5/ukK1cYlxd9etLumGFG06hUfv6Y8kLcaBqNa0eTM966h6jyzOmOuceC3NsKmoutzPLT2kl3nU8Bva4kDwX8rV9tntemm7EuXDdVbDh5kh7krmG6tjd3sONCiUkkx8SxNqmzdWDjUNvvSl6VdzyQm+Bpys998NmryyPG+ezgeRAFgy0VuKNRACiy/6cTtIgNdZZC2VyKOQGoUcbSgUgjhbR1jcNJZV6oibhxGzMCnbp5WqP4rX9ts0R5DjxILZhhtGfR40CM5sdbxMvZldiK+8C9Kz3rSdubY9bMzdExS7G3yvNwtRPDXenl77h4veEy1paLbNoEtrVcqw92iN33XFsdqixq6rjTFuNvcHMaaWTUTLy1M1caQKt7ZAaozk8gyuds4bHCBCfRaTMLyE7dV3mC9vBvLulI7FJEms91id9As83nMDcVmtDy+vh9qNuBNZ9ijz6kw+y9pWDLFh11FiRYHh5e+0XPrKmAAAAAggCIBAAAAAGIeEfBZaBgnKqBopNiTB0AYE4GDEAIGFweQGhsdCBoAcAAMtgZwCCADAhPoANAMlANKJwDIwiWk5iYqAxkEgBg2LO62ZNiEAwGEwMPiMDD4DRakmgtz6AGTiMBj4ZAYmBAGeTmBmMZ+yuvDfhANSAY0C4T/WpBsTgBhcJgDBMLqwMhDADEAWAUDH/e/5DgxoF1AdOcPBZ8GzYYz/+q/9QGFwWI+EeCUgbAAwQOMlBSgGAwGFlf//ZC77/xmwDAABhIOADCgAYNjSFkA2LFBi4xcAyhEE//////////////4AAACEEAAAqioHLAQAKBg5OCBrRRmQAzAwPgDAwjgJAw9E4A1gkuNCcACAgFh4GlAsAGBQBpWUAcEyMA2I1gM0DQ6fWTZMpAZIEgGGQCI6dF6DOgMEDBYhAxeNQMYg3roLNzdADNhkAywSgMdBIDU6fA0SS1ft4WPBdWkgFnAbMf9SCDw6QDE4hAwmBQGAGBmAkAYyEgAww+v7uq2OoLGAbEBaeWC0ASAwMDgULH/+1W/01AYnCocsHKBloDAQGAaAApcfg9QDBoLAUBf//PMm7rTTV9QncAAFAYiFgGJAIBhkCixCCABQPD5xO4nQUAOxNP/////f/t//13//9lN4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP/74gAAAAcqYkyHcyAC5YxJkO5kAF3RiSIOde3LuTEkQc69uUUTAQZMFBkxsJThxkMIj4xmMjFokDAuYTIxplkG93Ec3CJ/DTmv8ccOTpvFNmZyWYO7rjoaCrUU/WPK5gWJW5bHbsyw13YJdJtn6f5xp+JOU/0EM7X67sMuTFX9pF4gwEDEmDAJRJyMeb7nP7jnh3WGP41bNLGbOVWxAUPO9TPrS3WvX39Za/sjf71hYaryq/cztZZ/ndxnaWrjZyrfLqlNKo1GrOT7LDLqo5bUdqM87+NLLaXffw/f67K9zdFy1TZbdl2mHLua87U9copuxal1NTVqaXVqs7ZqxmrjjjWjVN3KtlFRRMBBkwUGTGwlOFGQwiPjGYyMWiQMC5hMjGmWQb3cRzcIn8NOa/xxw5Om8U2ZnJZg7uuOhoKtRT9Y8rmBYlblsduzLDXdgl0m2fp/nGn4k5T/QQztfruwy5MVf2kXiDAQMSYMAlEnIx5vuc/uOeHdYY/jVs0sZs5TNiAoed6mfWlutevv6y1/ZG/3rCw1XlV+5nayz/O7jO0tXGzlW+XVKaVRqNWcn2WGXVRy2o7UZ53WNLLaXffw/f67K9zdFy1TZbdl2mHLua87U9copuxal1NTVqaXVqs7ZqxmrjjjWjVN3KtlFHVIGH0KAcEwY1z2zD4sMeFsMHZhsHmMg4ZHHIkADONPN1twzXRzV+JDomKDbNJBIehIkWQF20wVDmJs1hugsz8S7bqM7kLfMHfCirQjOFylrSdrK4y5EslL/PrIMFrpy24MWGuy6rbwv4iS5eb3iIxWe4jN7jddsLxdQocqdep5Dj1X0ILl54M2GmjWzs75oa1ekGFju10b1s7HEfaqIIji4NpXsCAOdLsj7vjQVIk5xCaJ0QwjIxzMKQ702fjCwQ3sNXsjK3sUM6Ji3vjoL6XslQpZMh+KV2vNqvptWKc61IdCnZ2RXKxlfxmqaOIHVIHH0KAMgiBp/lmIRIY2LoYOzDoPMZBwySORIAGcaebrbhmujmr8SHQ8UG2aSCQ9BxIsgLtpgqHMTZrDdBZn4l23UZ3IW+YO+E5WhGb3ylrSdrK4y5EsjL/PrIMFrpy24MWGuy6rbwv4iS5eb3iIxWe4jN7jddsLxdWhyp16rkOPVcoQXLzwZsNNGtnZ3zQ1q9IMLHdro3rZ2OI+1UQRHFwbSvUiAQ9Lsj7vjQVIk5xCaJ0QwjIxzMKQ702fjC2Q3sNXsj1jYoZ0TFvfHQX0vZKhSyZD8UrtebVfTasU51qQ6FOzsiuVjK/jNU0dQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD/++IAAAAHc2RHA7t7cO4siOB3b24daZEYD22Nw1Qx40HdsbgydJUw6Dkx+AgxxIk+pc4xPCsxKDgwBCQiMEwnEcxXCMw+Fw2jJ4xYGAzuOgXrTJVUzoKMFHzEiNcTfRokAK0rYNEHaj0/HmFv80l4q7sShYdsc0zeDaJ430VpaA83JRPyiTOA1wMAHFbC4su+eqX85Z5mtSRL7i1YIUFunWz5YbH7hnkUZTKGdUvnqtg1b6UjuMCkGTbgc2FOqoJy5jL5yqg0j7ZUow3V16m8jnuJXqtgIch4hJiC5JwTY+VCplEkU0vWeebLbbFT9QLMzH6nDSXI9JsjdUCbjUbpXCrY+VqdRU6di1qxR22BfO3LZk6SphsIJj0Dxi2PJ8m2RiKDpicHxgGEhMYphKI5iyEpiALhtCTxi0MBncdA3WmSqpnQUYKPmJEa422jRUALUrWtDDtR6fjzC3+aS8Vd2JQsO2OaZvBtE8b6K0tAebkon5RJnAa4GADithcWXcnqnc5Z5pVJEvuLVghQW6dbPltsfuGeRRlMoZ1S+eq2sFrpSO4wKQZNuBzYU6qgnLmMvnKqDSPtxSjD1depvI6DiV6rXiHIeISYguScE2PdQqZRJFNL1nni5bbYqfp9MyiP1OGkuR6TNG6oEtGpChuFWx8rU6ip07Fg1Yp4MDP2zbME4JUwRAFjASARMLwAE1MiZDD4DRMHcCwwXASTA0B3KoHpgaAdmD6DOYPgAxh9g6GAUPqcDfHioxopSysEABEFrutxeQRGUM4aw4DKrSx2dO5Km3a1Gmor/cB5lkxOeTnbnAjxSBrlBdqMCX6g8llDMMzmFW/SWE45HRybl8dC02hqUUpj87B4VFsvKj9YTBKKxme1KjDiailGu7lyKxMXwnAjR4TXMscXQ3eToSRhOZ4/jOp3Tg/WMsLg2bbeS1ZQvZTlJpCxpx7SUfGy6MpqW4zSnXSQH7sLiEbnEsexDhvmK10EZ7jvr/+gxAH0SF0wYAowiTM+MMIxKCMwGBMwNDUxmGMwYEMLBCYeiqPEYZkjYFm1NfpDtzIy8ZglGRzlGcHvex05Q7jsOw4VpiblPxKnXdqNOa0N2IUwmVzyt7pwI8U47k1uoyptVBlaoZjNFhVv0lhsrHRyrL5MPm0N2KUys7FQ9FsvKlawwEo6O1ulxiiajsa7uXIrGC9lYO18MXMscXQ3eToTDCdfj+M6nqsXuVouGzcNmasoXstlJpCxpy3nR8bLvQ0TcainXSQL3YaQIziWJYhw3tj70EakAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//viAAAAB0xkxYO7Y3DrDIiwd2xuHSmLFg9t7cM7sWMB3bG5MkkSMKCMMKx3KkPGhPbiMajAIOwgETBYFhYWDCgOTCAhw5KDEsUzKwEju1ABeJlZAoGIwJT7WYacyMO9OyYu+4jHpVDrbJ6NMgd5X/clpqKW082tzitr9PLH4IlEFRFuL5vBDxQDyilp8Ji3KrWI1ZZMTrER3KOLkM+HtGamLBkVxLK71x1YTKU9je7RXtd4zYWVWpyqsJqw0RZEYqxdApI7ZbIDyI+oilg+PNZOCmdsH6ZwjtCIy86JaQsBXERVDZqfHokj80twgMlQ9PUIlF0e0z5Crn3Nkbj9XaZXylfT9An/+Sv//9KDJBEjCQODAMYTCWFj6YvzJ0HjIwlzBwNjDcQAQJBIIpigVJk4BhjKHYQrB1KINchmpAgcAQJhK3VMnlc1nUIhJd9rin5VDrbJ6NMgd5X/clpqKW082tzitr9PLH4IlEFRFuL5vRDxQDxCW0+ExnKrVEb5ZMTrIjuUcXJz4e1RqYsEoriGV3rjqwmUp7G7bRXs28ZsHHLU5dWE2ho7ZwxNxc0pI7Z+QHkA+oilg+PN04KZ2wfpnCO0IjL1SekLAVxEVxs1Pj0QRc0twgMlQ9PUIlF0e0J8hVz7myOj9XaZvlJvT9Ad+7X////+owjQSggNUSFyMF0I00oyMhoXYaBIEAB4QAcAgJzAuBDMBAAswNAVDBXBTMF8FU5hHMqAyg6MAB0RkD2xOyyCIy5S9/Wbq36daPtqtJ2kVXJguIrylTttMkUBMqiMZf1yqGG3Jibeu+BABTZ27Ea3TVashnjRHLUWrHtcP3BTNqdS6RHC/Yo6leVVaSaU64zOStsw2bpoUXTNFV1ZVxGg5h7xGZsKGK1KZgYoj969iR/aeSSsbGVa/ccx4Nlc5QaelnsCyhamXbLq8BrhtkvcpKMd+1Pr0pvb+jh2W0O65nhBgPf/+9X/+7+sx1DYxiBUxXBkwjQA9fQ8yLDwwSAcuSTAkAgjMKg3MBgHMKhGMRxFMTxHOCOwMihhkCANNZLuAn9bhEZcpfDLN1z6gaSuqwJ/kxXdj8yzKmhtxJFEmtRGWxl3rsNv7K3lf8tgup28JVutjVnY3qKuiqd+hNuF5kxI5BAa+1c5cqfl5GSXYkZ75zZpxpby6p1Vk4eru/kaqTGJCLzC5xuq1x+f/IKvZpivd19mx8qZpNMWsWPYFtlvXYQ9SMyqgovviEu+nf6+jmrbQ6XY1zhwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP/74gAAAAeOY8QD22Nw6MxogHdsbhqlkQ4O5S3DpDHhge0luTCwFaMOoG8wxQUjB0GxNZgbQwugMzAbABMBwCEwGALxUBkkAGMAEFkwVQPgIE0YEYH5y7YLGZaavGlLAaBNfVhiKmqZT6sMTnh2SMkfWG5TIS6bSLDfMagOjktHXlNNl2JTU8/LssMZPC47LYhQ2tvlEyEbF4xPUAsKngID/U1LglDZ0nLrwHY+4uHIShqXULUZ6cundF5+Sr+8VU4kpBJPKqlY7L22IXUiZ4+2/RzbHlsZSM+osoy0uUL+1x3eVYjleq15adNWWurFq2UdWENjKurKuUNomBqQr4hnv1Qqmkvpuire6u6zsXlo9aT1334wy0VgzkFMLCIYWtWbM40YJieHAKAAnMIgpIQVKoAAEWTFUPDAAmjCMPzl24SM0g6eVKwBUCcdWGCVqpbPqwxOeHY82j6w3KYSXraRxvlOobv0NHXlMutdgKgo35dlhjJ4HjstiFDfzfKGyEbF49PTQfEF4CBHhNSkJQxdEpq+HY62XDkJQqaqWrnq1SnlefmT8ri6nEk4ElZVUfjs36yGqQvPFqb1j7MXLfKRnvJIoWlxov7Vlb1R2R4+qu8tJTVmXVi1bVXXIWLcysq5Q2iYGpCvSE9jqkOuI3E71vb7qJtjH5NNUpvu/rNUXrMuh5MAAdMWGqNZNPMKhIBoCq0goCzAUAzAIBwsBJiAGpioJ5AEJ8Jiy4AFibjQFYhl/4FgpdFd3KeVTDv34zTYu64GDOl1N81l3IzLaeZisuhrKctQ5K32hVezKct/WriVlxtRgVWSsLaKQjBo/smpiKbSimssYdQyQ/E46caQ2WeJaaZdkc1CiluRzopevVfMUPxg/M1FJNlFeRnaxZZvquTSiraiLF3SSRRQrKoY5iKcYNolm5zS1lX+TSskafUitqsa00dm06qblse9JhrjbUmMWRaYcgGIGA5MLoD011BpTC8ACFgTgMAyCgGzAFAJMAAAkEAImCYCCYNALpIBScYyRIwgi2NhzpRCHXbcmSLouuRXlUcd+jlsaxclpHsSU2aEw1xH9jMvmYrFn2yikufiPuk913kptfrVCOkricogC1iUSNTFIRYRH6aNIwGs0oc1kxEuSyQxcuhmcREujQuJYGkLsVjqEs1uR/RSqvVRZgofjT8jaJpNlF7jtkQqRN2q6a2IYsIoTc0saihWVQs5hEr3TRInzmWmyQstv6k0d9Sv81btEz939/Jbz+/cb9sM3Otlp7q/4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD/++AAAAAHNYBBA9gzcuoyCCB7Bm4dUkEAD2ENw7PHoAHsIbkyDhjzDbClMfAF4w3wLjixLeMSsAswRgABoF8RADKsRvMBIB8wJgOwKA8qNBGj2B0JVNdj7bVWqQpXIQmFQuUTjlSJ0Zx6qJMWHYao3ia3OYUz/QTFqaVyCG5NOVZTEJ6Iyinw5Q1LknJyYRNpIUXp4IcDwNSSMImRFZZRmgF3mLNrDjLG5eUbJbGuEluUDQ7JKzN1sckWYWYkR1ZCvPNbXUWWKNhWaRctB0Ck8yKLRKepRL8I4o2jspKr+uc+xrmN3nUDvXee+l9Jb+6tGa/2UqL/7F8s7n66enlJV8fHlaQgDLqKPJGQoM2YcoCRiHAXmDOSwax5kphag4GAwAmYCoBSPyaLGzAMAhMCgDsGgPK/L7oJyJCXz62X3mWwOOmCXhkULllhyqNwZM+EUU1h19qN8GHxS9TO9HX6tTcshuiimMZiEuiMst73VsdUI0awKXTA0pnhAovQkkkYRiKlSbGHgFFRGbdOTCFhlWYkRRRPc0jwXCSmx5czaZ3JTyzK+kxjMR+enRziizIUWaa6CNCnvMY1FA2USMwcijJutOJV9Kbf5aN12nXycxy65kW5l9L/Zqtpd41Xhfn135dR2qujVVt/G1K6ha6O5Xx3suDCxJKMPEKwaOtMJAsM2bjcDDSBtMCcCQCACpDKsTiTGMBgBEwCABRwANIgRDXXP4y1pMC2X1TsQXyXLLXdopdWzoqKRQe9zxxShdiCtyqVyyM191J+PV6KCpqRVo1VzvT9Q4OCxwz1dDiB6DRNNC4KRwfB9VDHFzGeG86HPFT3MOGihxwfLQnq4YGzUY0kC7xv0WyQ3ZbE8h+axTOKwIV28hNR5AhkD4Iqj5KQerOiswoh5ttTmjFWaoVeGS+5W0J48gu+iBa76eLVTmxRWsVSCKLcZcOezXRs5XBVzDWWjjmoxzERxVaLZDaMJskIxJQkhISAwhR4zQRSOMIcGkwIgIDALANEQBQOAAQPLdGAoAmYBgAo4AGigFhlzYabHi5kCOr7CB4dVkM7M0Uqo6eTSCmkbbQHIJlyIapa0rsSm7nRWpirOyqVWsLVLSWMbhQoNZCBo2baM0aaIpVipgdHS9nyYPZCiMsZMiCephRNWIzPTKSatj6geIxr4+XsQjWdLWDiiUWBLAwRxoqcGGbGFKIcOMOoxKdTmYclyPqRCih1M4+bgyadKje9zrlpWRi09wfJaXbpmFLeQNG0s5e6jBkcH7i4+VLWHasp5gsYmcnME6I0DOEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD/++IAAAAHS5A/g9hLcOtyB+B56W4eFkD8D2Etw0fH38HXmbgwIgPjASF0MBcOEwlCFDSGR5MIYHIwJQITAGAGC4AY0AWnA7D6qvSQCwYFLQ3nIrQZYuRiBxY0ge2esTm5XNWrtuK8rWM7NvdTVLbpsprlukrcnreWf26tL7FNFYJI4YaxaUUS6BxxmezcRVNDV8eRjq5atjHevKk5rPs090JEUEM05xxas8t61qqLwi245c2YVHEvJluRmEc7oRezaiS7qKSJWr2TSTqbZi9ElqiBBeySRptQmy1iVwQyYVKN5kLYYXbWm9dGvPLzFKliuxaizWtPRelYl6SS1S6/lqOKrqzIJbXbuOWjYmYBAOxgNBUGICBOYagc5wqDXixEg8E2LAUInp9p0LkbutdOgAOiehGEWrG5XxWN4ZpboJ+HEjnr2dhZox8rLIpoEd0xTQOwx2LCuc3zBad9ieNvStetijTwqmfynCa5wui9lLIf0Taklixa4Nyec1fvzHa3W2s9AUfbdNpI8hM80jWhFGXWdNmPLLk5VdtvUcHOiWJpwd4GCqfe5vFkRgosqgymugRm1ciuS49L2seUkflBpRFBo+1kY3b5TyRaPZZxAnNFUuWk+VsG7xBS8cfllkMpeEyiCTKe3U6m6a0Owp2NrYJEJFJJpVtQwMAfzAFD6MesFsw2xFDd3DyHiAg4HkiAbGgCHiayvhncGs2IjPagma03rTYvDsphDG4pFWCQ86c/Lo7dzv7m70bmZi7Syykq9vYUViXUtffe36uNqhrUdPIsuKVJwTMLQt7T2pTxG1hLDpzMeJqJ8ajAymolOtSkm2zPxG3dc7m/npQnNJdOEqdPFY01BOSyqbZ1hp7jRWLFpxWgrJeCqrTC81G61nYKwigbRpqQgi1vYrTUk+CGcHpTOK6yXuCuPtE9NxlZDPYOYSWkhlsZ9LiS3xjPdqSKMJoYJryZQLLyQybuZCyjI1GiMqfRbsVkBgsMJgUDBm6GZhu4R63UpjCIRgQBaezd3zkLcn1cmBgRV02fa3t0kl0plcKmAyPnKzdBiR8t14rlrF6vnk0m8zRNw63tDrBrbUfcFkjItk9QXjhqrPHlNlM8HFlmRZh7myjGbMlD52kUEvhF2KHSf0VBRy1ZMOWTLA1/JNJaRp5iYGCIFEJM5RM+VrN+l0lpqW2fw1oobPqd+kmBae9ZPyfx10q2j4UVwQm1ES+KLTnCOwq0zE2MZOG4UfT3RI1jRMI3UITTnoJRpOMLZ65kLNX0wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//viAAAAB0iQPoOvS3Dw8gfQdeluHe5A+g89LcOyyB9B56W4AoamCJWnJpUA2NzwTTjEIWQSCxUAFnGMqaYtdd9YmBQghanLh6qV4cTmEyhZeXjM1M8yveQGKC33rbULtblKzQJqNkB1CWpHseO2zyx5YLNQczrTIXnSkWNW6VZlXUloWj/R124Sghmy1JNtJow29pNO2zUzXxYyp2jq+IUQzIjlvQr9FqtzXL6sKVcQ2TtGY0nZOciitfFzTFyfBiMGyJlFBCfMpY1FrwepRFBrBTKyCV9C26b0J/XWqYOTisiO97FK2606uTJOVtNE0XI3ITDRMgQromdZNk5IvaMtCHfNmJIwkiHpJ68KiKKE+Y6jgY4qSf45wZCh6YJAQW3L+LEddpTD4frFEdRKXlVpgNRVIE2C2n8hasYmdXzMz2umPLlKrmGsGjYxKp44NjJjcJ1D1SJDs6lboFiiNVGYamI9SVUULI0DTevjPYoqYQQQIl4IFzlGWrLJFyE9kyc3Johk9RdZccXgzT1FiVY6hSYjckZ2Z/pli8HiiIRXRsJyoXIIpq62kXJHSb1FfgLq6WYV1dAp0OlJ9DfgiR3IqgKMrpTyLDEaaUZfNJMjUhUiSS6ObSTaFSRdB0QoVp5Ds8LyjI212GF2m9SceKIDB+IpXxXoFTxu2Z02YGoApgACimEmDkYNAZhoLFFmEIBYAgLy1hf9k8JwZQ2mR+0FshmjVaVq4LYdZVs6rVpnYesK7g68F/Db6QHm9TOGYDxyf3jxW+DmFajDE3GPuSQjJKgx6yDOgxA9pGgklZle16UauLEaZixRYhVZSZc5xylJIJqORSKw2DCkx9FSKNLQlFiBzIFHyYcfMpTOVGD6nNVAaIUTUyZG0nI+pODRr6+ix9YiOtm5ojctaX29KNJJkUzieIz6MiiZtEQn7xpGTyFJqDF2gbZJF2Itp6RF5RKddeh1AuwmfWYiox5zIyhpWU+cXjOTaWM3LbaMDUAswHghTBuA8MGwNc0qAKwMJKGAfKQgd06CvGXpa84uS6U+op/KBTRTiDrXkaqDualcn2NLOUdxi1gz1h9ypJW+ZG1lpWE8kgRY8fFarwRpJtIUj+mV3rrt4yUbegwrCK3TdJktiMoe66dXhMsrlNoDumKSmdKKrTaTtdI3A9c7oyyaaRG5r9Rfl5LqrHJppaoo36JImWEFybgbQMTTuRXXdqRqTCLQ8hTm83BhTDCuuSR9dGgknKenkU1Ea7ZGyVMoYmAtHLlsyBnzkp5jCsh1VEoYKxYVSYWnJpZmRcxJpBjJFGEpEEHP164AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP/74gAAAAddkD6Dr0tw2HIH4HGJbh0yPPoOPS3LpEgfQdYluBIwjBQ5zaQLjC83j/MhzHcABIHWhP5dhvTsPvY67FzisDGP1XpKRPqJtVssCaK1yQmuLPBklaotMsOll/2uFp5HV0VwpV9JSrH2uKF6W2L0ugemo5PymyfI4hUmxgtPF0MPfOplJfG1cRpZJBa0Cy5EjTQJzLtkOWdMSTXDE3sQe9CftGkPqSmcwh8C7cFF3o4QWNWTqQKTQuXplDFgiGppqozTJxtCTockjLPmZMJdQkYgVjGIWIV/AmbQCjF0MyGTK1snG4KxnFZRREuuzGNzQaYP5jbTaiBEjSWQyUhGSyIygaIzxCsf5i0Ycm1eGxBKInwch05g0QIEYAgaNwzD0XlFEVrhaMjFWRhoVEVgQtjwdniqePpqHbzDLLjMKmrVdXusxR/STnm/2iyi56057BNKk54gQzgm5Vucy5S5SINKeDC5p8kJ+EsTxRpmULXZgzhxV+Lsbi8HGnuJ5nIZkYzbg0MRhMmJosJF4YT6wmrDZszmSqMkUXSazRlJeVytDcHWw1sZyZxO2mpoYu6EtCTqdbSyC1P5UnBGoxLEstFClZuWRKR9svWgPQtZSSSpZFGpp+SCTa0bzrIWoNQgoaYXCHEYiEwLyIAfJhzkBYPjoAbu7TdF3ymGpDLlKYIxWFuUqsUUdXKrrDqRE2ZorZfL5qiXk1uI46jMcmH0aLGrDiuE0DCsY4utoDRYtjj0ZwmX8TRM2hnK5YSpkiFJuOqzQI44mhpI5BlIo9D5wtY4eXng81kmFzhk8UiiipTcoqIl+q3qfONSaickSHie0D2EmyUkLoiySahDqSTDFHYttiyjyqCzi7QnHDBFhmVsEJU/TBChZqaA2zHdWTnkbi2XFNtNozjBUwbVgTL57pgb5UYuYq7NKdAo3CpY2mKUpIXsU2SJlCAtMz5R4vhQTDHYCzCsXzmNYDDcCS6C11NIxD8YkLsylwuBMRiavEMfCyWx9Q0pcVIz8ekVUCy1FEiq3RuA5jyGt2OUJlrTELypvT6l21XMWvJYugJtybTyiRuXWPYZ5BZWSFKbccMRk82nsvBaZGKEMNWTMOW0K0K0iM02H15O5htE3FRRTKNxPI4k0eRo6TTatpy1SaZ8WVBQumuSvdk103HtGJMylN55MwsuwaRzR7ZpYydPIEZ9VvHqn8SQRKyVXa27nFNNEJ1yJhZtszFH5LK7ExMuiI43hPasi6Bk42q0eQqG18Yks5Z0GsAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD/++IAAAAGsI+/A6xLcOdyB9B1iW4c7kD6DjEtw1tIH4G0pbgmI4EGMY8CqYUA4cNHCEDogPdx66GUP3Gmxy1REdhkOBi60JJXHuOMwMlL90rD7a31G+83JxLP6WP1fd91zMp6tzCmvZUnjDDyEchsHjNSTNNofqp+m0bJWVfane9dllWStbOdQkjmviRM2wjUlCoQa0qXmT4vFXtwMyj4LrtLz0mkxGLTdLGoHhUWRT62zI1bYk+bA7quuZPRggub14rJJvvXNI/4J1Gc8c5FLZwrWKS6ze26FVB3jus8SKJPI3dleBatQwLo6YY6msLSaxP4pNtDDYKxGiiHRQMWQFMGBtOSBEBQ4pNKehqCcZZI7UaL74RiUOZ082vHBMPx2Yo1ZabPjlS2srFjl17eWX9S8nilVHdmkZy845d1PvOSt66NnFSVUlELpGl7MRKi8xh8mLRqIEp0o5I4uSyVaIUkRDWzsyQRIUipJsitERSCO00bKUG0cmJRgmkQLKOnJ+og9b0Z1Bq9ohZaES07XaIEEZYT3A8/vuJCI11FhKiivi8pqKylJhDOBhmKdtTicicWVeeTXjyxiMFJzTamyStnH4gbXZm0jWXWi9RyEriFA9VDGxM205dlDBlpuR49gQNzBq+N+kcwmsDuY/MBgZhr5usy5+ZFS2ZQCFR7UF1QUnBBFSwmiUkKS48ZesWIFbtMW8vTJms2z0Bi2oqiXQV08gpCdPUiRMpn7Rh9ITR1C4jGbWastSjBAbVu00S5NInMMIiQkZNpEcJQdLjk14UwfkStTph6SKcFtknK01YwaIVGol3xJ8UJ0jtRNECOi2Rac44sr4RRHB1C9s+KVEjr5ThjtQSQM05tEiShI1RjD7GFoIJPGMnBjq0NGks7a2N5bEiIuKGFT1mSViKupkz4ea9GG4KpR5AaLySWJVDCBbFjcF0lLGjoKhBwICIJQKVZggA2GUNs985atxWYFRGBmIJEJO9EAUSnLJ0BEbQJOJSdS1VJxp9MtXBmWyKNymjcUZZXQLtlV1des2qggiMbL2wyKWS+K7rUX3bJSpLUq+MYEJdpaWI6TwolVwkmyeuaHGEZy52qw3MZiyuuZUYVqLTS8YKYrDFV7kuiZZUWZUSQK3PfGFRuno9p/gywsvO1IJQm+E3QUThC1JUW5pd6/lM81HF7NsTSohZtGu2Uh0SaipiL5bAaMIUWpqQkUTP9aLLUe1mqRVirKkEwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//viAAAABzqQPoOMS3DxsgfAcYluHiZA+A29LcOIR59BpiW5BwADg2dLBxhcRmSz0k6sI5bJWvS2Cpl8psvsj8FKwyMT4YDqgHxwdxk3YnDFgyiejtZyBRHEsp81g59e9tkUFDnbLqHi7ky5wiQECVJQG12x5hzKzC04Jqr+mTSUUlC6u/Mc2TrzLzUVnrFG7xc+TzXQCtpE5hW5ntcUgTSUb2DJ2dUVP6iivHeN0TQma2BrKW9kjJ9U2JUEC6zbE5TRMkq5uClpnkBUmLFo0uvIVL5HlWzLBw1MhLLm2MyCxA9G2YVR0gWRIkZVsQNMxhUCEw5hpZyxRrZEEkRZon7KxZtlpRcJTONIBEBBkdmYQgYZDx08YA4Vp0MCvTlh7LPXeFR+AwcQIAVSCQBsnNGI0nyxZMLjKo4VnjiGvU2cOVue/d1bB69Zf1p4hKSk/UdiSaIqsgQNRaaPJINaofMQJhNiiy6EzovgqLtsXPTDBhMwMLIqyxRYZHYE7dH5KSWhJk8JFDbSJW07DyxVI8sse2l3HbFbSHokhIH2xD2DOk6BDCBsvixPaEgI2GF27gXMoBe0stNY6lHYNIH0viskiiykqMsJKGhINWebWYQH/ogSWgjQwYIYImULJOOHRSmzTRUrIcbwRyn0kbCyVEkzriIUpsiBJcqXJzRnwYF607dMEAOekMjQTVZbBcv9+8XbmVEUZbYRPF4ny6OZiu6QtCMJNnmnvjvYkFqcV+XbLadl8BIytzE3bXC+3tVnPUjO1CiCqNk/Js+amTLIyB0sm0iZUn3NtHUKN0kbj58RQbLSKIhC81Kz7K4UIXibENEwsSTTKrGxfxPS5LAkikTLNyORk1N0zcHMDykzR16i8FEiBGjNwdBhGaOjSjL4lJlSFar0QtTQEMhQITYoWFDa68E0BObhFYEoxe1Ga5LNAXaUpZiJKXTRyWkzNQhjK002lxgwWNnVos6hmoK5lYsvy3DExSwdgseoKL8XNoAFHZmCA43PRYR5apH5qNRKWv1Ty4FyQ0H5GHY+J4HiZicmIxwT8kvD6/nsP6RL1qxSsptEsTlHrMKll3eXJj5tlcliq2g1mLLNV4lj/ICCJ9hlOFQipNIoIzCC2ESFeBlg0UtEhFU3wmwSzZIYGJPkiwE0KokD0BaZL1lULRbimWsqc6tOaGczrTX69rxZnTBpFIuHnknQpOXUXFCyitJsYeYWYkgHG4Rk30zNclmrilJKLrWs20tayy0JtU4ohhKJCyubXI+r5NxmeTUpiMIm4CRjUGvWifQobmzNhAgNlAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP/74gAAAAc2kD6DaUtw55IHwGmJbh4GQPoNsS3DuUgfAbYluAycMAhzlCYEDBppmu6vRxyKvO57t1okJR4nGxcoZIhMLDAJA2jZLNnG4Jpl4KmKoiPiVg+iQHLKFUoKMSksMTijhanRPMEUlaUNMLKESqMVNF0RIKm2SckUlXeoy9bGLUKHTL2CrZlPiiJ+TTMlbxwpioiaRNryYOqslTc+8muBHFAZadJpUdRrqNMozcITdqByFktpKu9AHl0E1ZFkWo5NHy0Uj5FArFG3qq50yxu06FrMPhpLp8hYWxLl2KmgnJNiptChkbtFqhuUdZtGlNpgU0jQRJolHoXwZLMrRIZMh9gygZgbYF3gUBkekCED8X0KHTfB2XXj7Mbe5QvJjB3h2KxSJ/WskUCASXLyzE1C5dauQySRq1diaKr2WjiPYr2jxCk9tZu2ieRmDJYwI4M3E0rOptvQNmktIEooI6KaD1GJ/BSTBVoobmrSRYgNDY8jIUBuAqgySL4jSlKUC6QxeqimQXWmRKvNrVidDobaYSWNImn3hsnD2rOYaFES+ytpoVPJR5hmyqCCEnigkJnlKQ1OStIFBFRsmIm20XUQJ1A0yUWuK4lyhKEGybVl0lw8hIxyS6r5PnBGgD6sciR58QuC100K1bOOR3ijaAMiQYOg/JMEFDETRJ4tIigXwSLWmy9pcWg8BSxERlohj8EYhiSNY7rB4FAwhMKWZP4Xv5tgwYL6clmZ3cr0Pzxh6o+pqro+cacOJHiBZtEcWmgkm2SRbI0MzZOKSVlej6sSqEunrSypaMRWMiU2k4XUaYk4oZktiiBAdk1iRlBMSo9X7QWo0KJIDDkbRtWNinWSBk5CJtvZlmolajeDwpWkydw6ZyKJhtKTMVHsSgogmetcvBEkyToIuX662H0rZRKHdKrv2TvFsl6MiUISMjWiuWZIjy2zQlVZGER8RlVXM1JVEhtooihSFdbUmJNxQYApkLDxpASQjhxYwmArx6Jp052Xx3G7I+m5UFxLXhGC4NiONZYEUKUIsSiUuIaG6uMjhbGVEalefvR8iTrjLLUIzrLSajFiTmJ9NjVEawjQXY8oSI5leQy3EyJmS8sMeZ5EZUiygrRO6MxozDqkhbW+ApArCDkkBKTKEKaM65EdZMnmTasGRkQNEU2EUkERojXXgacV1q6EKb0G9tNcnIFDaZOqEFF1y4e4gVRzVLgkXZiky01rKfIXXqweTPS+o7kQTZghHVQ3CJ2c0zwhmqRObeXLKQJ1Fx1CwfQo/DCPH2fTMKqkMW1po3oiRFa4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD/++IAAAAHN5A+gwxLcOnSB8BhKW4arkD6B6Utw1XIH0DEpbgi0AFl2AEqjj0fjrSWvOE4T/M6a0JQhAsBEPRxEkSRaidLrGtwsOkkxKpaJx0TnkJcbPOct9Sy0dQRHvO1ZWpRJfOmzJYVGk1IQWksoKmIJCSwqQmIKycTmTLMMMQKGyZ5NIuinPYsImDqKS46KRTCxxtCpM1q0Vjut0RJkFUqgWSZekpp5Ep9GNuDrcal2wyqmmTI5nvRswxj4oFGm4FYlCJ0yeLh2cHn/FCrFJc5OIiZXXJe25WAgMSTaE7rWnF2ILiT6iTWPU5svRGkyGaTXlBlZWewVKJN1SNFKBpuSeJvnJDZCvpvIAjGNhxEouW1bVyXBdqHnCfqAoeA0JhpY4XmyhIYH8pUKmTEWVThAcZEAuTH0YrtCk5gkJlyEwZMCnG08PtE0BEhkrFEtszaMeZIOuZZOTQM4ogYOEarUCm6i7AwsouLiUgOyWJkiIVki1MGZoTTiddeEzKILsDqjSxDsUCpsmQmrJOgWW5OLsoFUsSa123KCIy0EB2LK8aWRhYnQRFCJMbSNEqpkviZ+3kTRrX7sGaPIcWduTMzFHcYRNSnIUvXbNidRmRVlGjXXaMrlLUJ1JpWbiukswrcETyKk2oJitHpRKZQxKD5RQDOiPLMV2XWlVeLHfRIo5rkkG0cCiOVCMkZamvRkmhXekhbYNotioQTalkpJZSWLRUICRtzCboIaQl0FpIYJKkUCFyyo1c5SWiJCRhYSrrnkomt0jTXihHEVLvJFs0siMypdfDjK5zEDHRxmgWTD6FwryEMVgTEs5oSiGLRs+ukhXV1cUprkWqCC6EajbHKYqhI2mJnWxZz61yK0BmIWUVIenmOIFGjLR5ReTWSxpUxebPqR7GI0GSjCjmo1T8xCaYaUshYKTm89S6SaSTZ0ZwVRYmkhxYIokRzKo+bpAVHKwl1WUZIDIoNMKmyyNZV6EVIliFtC1qKJUQJSm25djEaNUVta43CbciDC6cKI12NXc3ssiyUmgbLRYATnVUjKkTDZku21xyj1xkiI9ZKZTaSZ1VNRGSRSNrOQqtITy7RL0aiRH0oLEyNJJAabpEgRoEGkD+igemi/yEVcUQyXUPavj4LHoORsFw8bqbLBE0ZXXYpqKrEGO6Rg2uo9KaEwsdnRJZtG7Jntj1F9fE/FlCZLIIkTC1Qi3fOsiKUYChdAww+EWDkY1UmJrMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//viAAAABxeQPAHpS3D3UgdwPYxuAJAE3gwEAAgNgNvBgIAADeYWWEzZrbEGLCnYYiJqNwRSrlRSSkR8KgZcFiayFEmCKAmniwWCplbUKhMmSlQy6RCKVBUiiqFQRJViZVn9CSsrNRWZpEsRNhUllSK0JCFSUsGiwqatCQoYkKIiaISVIEnoZVJqRE2FTxCZWmhLCpoqRNKs1bKRMWBI1krgKmxU15WhSaIRVJYmKilnqokSJ6rNLCrFkUpXhETFhU9XNukVIpocRTQs0iRarhECRNnpEia8k0SaFImnFJFFChQxqStZ6shcsiImVmirMtWmRPISUs0qoAZyLVcluFiFn2hzoUIiUXKtcbXrXL1Wq1OoasEp86+AyfdzYjlxcywZPrYHUxkuXHTzLK6NmrKlMZPFYRlXLimBFAHIsnSpbAfMupltLat56FbbLelJsRWBIs2ZcOmzFyM6fJJiYntDI+aXGSpkxJp7Q5iXWt+WTGLtmjoyPrHRiSVLV+Oic8ypKwlPV7DoQRFPeOj6xKJ3QmLhKJzx0+ISsSVAlHzRkhvYujW0Mn1sJjT5w6jJMZye1ZrpyYxnMR0ZGS57bPatqtoIQjOs0XQutPWrRc+to2YjUAKWBGTqTJ+IlOH0LAlPukpBHIRo617Tkx8vAkPxy4fXotWsnLpWEY+XD2p0Z/kUp0UAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP/74gAAAAAWAbeB4QAAAgAm8DwAAAA0BN4FgAAABwCbwHAAABRRXGdUZUCTAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=";
        var lessComfortable = true;
        var profileMenu = null;
        var divider = null;
        var USER = null;
        var terminalBellObj = null;
        var treeToggle = null;
        var treeToggleItem = null;
        var dark = null;
        var avatar = null;

        // stop marking undeclared variables for javascript files
        tabManager.on('focus', function(e) {
            if (e.tab.path != undefined && e.tab.path.slice(-3) == ".js") {
                settings.set("project/language/@undeclaredVars",false);
            }
            else {
                var markUndecVars = settings.getBool("user/cs50/simple/@undeclaredVars");
                settings.set("project/language/@undeclaredVars", markUndecVars);
            }
        });

        /*
         * Sets visibility of menu item with specified path.
         */
        function setMenuVisibility(path, visible) {
            var menu = menus.get(path);
            if (menu && menu.item) {
                menu.item.setAttribute("visible", visible);
            }
        }

        /*
         * Hides the given div by changing CSS
         * @return true if successfuly hides, false otherwise
         */
        function hide(div) {
            if (div && div.$ext && div.$ext.style) {
                div.$ext.style.display = "none";
                return true;
            }
            else {
                return false;
            }
        }

        /*
         * Shows the given div by changing CSS
         * @return true if successfully shows, false otherwise
         */
        function show(div) {
            if (div && div.$ext && div.$ext.style) {
                div.$ext.style.display = "";
                return true;
            }
            else {
                return false;
            }
        }

        /*
         * Toggles simplification of the menus at the top of Cloud 9
         */
        function toggleMenus(lessComfortable) {
            // remove gear icon as redundant from both modes
            var bar = layout.findParent({name: "preferences"});
            if (bar.childNodes) {
                bar.childNodes.forEach(function(node) {
                    if (node.class === "preferences") {
                        hide(node);
                    }
                });
            }

            // less comfortable
            if (lessComfortable) {
                moveMenuItem("Goto/Goto Line...", "Goto/Goto Line...", 110);
                moveMenuItem("Goto/Goto Symbol...", "Goto/Goto Symbol...", 200);

                recaptionMenuItem("Goto/Goto Symbol...", "Symbol...");
                recaptionMenuItem("Goto", "Go");
                recaptionMenuItem("Goto/Goto Line...", "Line...");
                recaptionMenuItem("Support/Check Cloud9 Status", "Cloud9 Status");
                recaptionMenuItem("Support/Read Documentation", "Cloud9 Documentation");
                recaptionMenuItem("File/New From Template/JavaScript file", "JavaScript");
                recaptionMenuItem("File/New From Template/HTML file", "HTML");
                recaptionMenuItem("File/New From Template/CSS file", "CSS");
                recaptionMenuItem("File/New From Template/PHP file", "PHP");
            }

            // more comfortable
            else {
                recaptionMenuItem("Goto", "Goto");
                recaptionMenuItem("Goto/Goto Line...", "Goto Line...");
                recaptionMenuItem("Goto/Goto Symbol...", "Goto Symbol...");
                recaptionMenuItem("Support/Check Cloud9 Status", "Check Cloud9 Status");
                recaptionMenuItem("Support/Read Documentation", "Read Documentation");
                recaptionMenuItem("File/New From Template/JavaScript file", "JavaScript file");
                recaptionMenuItem("File/New From Template/HTML file", "HTML file");
                recaptionMenuItem("File/New From Template/CSS file", "CSS file");
                recaptionMenuItem("File/New From Template/PHP file", "PHP file");

                // re-show divider below View/Less Comfortable
                divider.show();
            }

            // toggle visibility of each menu item
            [
                // Cloud9 Menu
                "Cloud9/Open Your Project Settings",
                "Cloud9/Open Your User Settings",
                "Cloud9/Open Your Keymap",
                "Cloud9/Open Your Init Script",
                "Cloud9/Open Your Stylesheet",

                // File Menu
                "File/Revert to Saved",
                "File/Revert All to Saved",
                "File/Mount FTP or SFTP server...",
                "File/Line Endings",
                "File/New Plugin",

                // Edit Menu
                "Edit/Line/Move Line Up",
                "Edit/Line/Move Line Down",
                "Edit/Line/Copy Lines Up",
                "Edit/Line/Copy Lines Down",
                "Edit/Line/Remove Line",
                "Edit/Line/Remove to Line End",
                "Edit/Line/Remove to Line Start",
                "Edit/Line/Split Line",
                "Edit/Keyboard Mode",
                "Edit/Selection",
                "Edit/Text",
                "Edit/Code Folding",
                "Edit/Code Formatting",

                // Find Menu
                "Find/Replace Next",
                "Find/Replace Previous",
                "Find/Replace All",

                // View Menu
                "View/Editors",
                "View/Syntax",
                "View/Wrap Lines",
                "View/Wrap To Print Margin",

                // Goto Menu
                "Goto/Goto Anything...",
                "Goto/Goto Symbol...",
                "Goto/Goto Command...",
                "Goto/Next Error",
                "Goto/Previous Error",
                "Goto/Word Right",
                "Goto/Word Left",
                "Goto/Scroll to Selection",

                // Run Menu
                "Run",

                // Tools Menu
                "Tools",

                // Window Menu
                "Window/New Immediate Window",
                "Window/Installer...",
                "Window/Navigate",
                "Window/Commands",
                "Window/Presets",
                "Window/Changes",

                // Support menu
                "Support/Show Guided Tour",
                "Support/Get Help (Community)",
                "Support/Request a Feature",
                "Support/Go To YouTube Channel",

                // extraneous templates
                "File/New From Template/Text file",
                "File/New From Template/CoffeeScript file",
                "File/New From Template/XML file",
                "File/New From Template/XQuery file",
                "File/New From Template/SCSS file",
                "File/New From Template/LESS file",
                "File/New From Template/SVG file",
                "File/New From Template/Python file",
                "File/New From Template/Ruby file",
                "File/New From Template/OCaml file",
                "File/New From Template/Clojure file",
                "File/New From Template/Markdown",
                "File/New From Template/Express file",
                "File/New From Template/Node.js web server",
            ].forEach(function(path) {
                setMenuVisibility(path, !lessComfortable);
            });
        }

        /*
         * Toggles Preview Button
         */
        function togglePreview(lessComfortable) {
            // determines whether to show or hide
            var toggle = lessComfortable ? hide : show;

            // gets the menu bar that holds the preview and debug buttons
            var bar = layout.findParent({ name: "preview" });

            // toggles divider
            toggle(bar.childNodes[0]);

            // toggles preview button
            toggle(bar.childNodes[1]);

            // toggles run button
            toggle(bar.childNodes[2]);
        }

        /*
         * Toggles the button in top left that minimizes the menu bar
         */
        function toggleMiniButton(lessComfortable) {

            // toggle button
            var miniButton = layout.findParent(menus).childNodes[0].childNodes[0];

            // left-align "CS50 IDE" within menu bar
            var bar = document.querySelector(".c9-menu-bar .c9-mbar-cont");
            if (lessComfortable) {
                hide(miniButton);
                if (bar) {
                    bar.style.paddingLeft = "0";
                }
            }
            else {
                show(miniButton);
                if (bar) {
                    bar.style.paddingLeft = "";
                }
            }
        }

        /*
         * Toggles the left Navigate and Commands side tabs
         */
        function toggleSideTabs(lessComfortable) {
            var panelList = ["navigate", "commands.panel", "scm"];

            // remember tree visibility status
            var resetVisibility = tree.active ? tree.show : tree.hide;

            // temporarily overcomes a bug in C9 (tree is forcibly hidden by enabling panels)
            tree.hide();

            if (lessComfortable)
                // Only shows tabs automatically when less comfortable is disabled
                panelList.forEach(function (p) {panels.disablePanel(p);});
            else
                panelList.forEach(function (p) {panels.enablePanel(p);});

            // reset tree visibility status
            resetVisibility();
        }

        /*
         * Toggles menu simplification that you get when you click the plus icon
         */
        function togglePlus(lessComfortable) {
            var toggle = lessComfortable ? hide : show;

            // finds the menu bar and then executes callback
            tabs.getElement("mnuEditors", function(menu) {
                var menuItems = menu.childNodes;

                // tries to toggle the menu items on the plus sign
                // until it works (sometimes this is called before they load)
                var test = setInterval(function (){
                    if (toggle(menuItems[2]) &&
                        toggle(menuItems[3]) &&
                        toggle(menuItems[4])) {
                        clearInterval(test);
                    }
                }, 0);
            });
        }

        /*
         * Adds tooltips to maximize and close the console
         */
        function addToolTip(div) {
            div.childNodes[0].setAttribute("tooltip", "Maximize");
            div.childNodes[2].setAttribute("tooltip", "Close Console");
        }

        /*
         * Find the console buttons and add tooltips
         */
        function addTooltips() {

            // adds tooltips as a callback after the consoleButtons are created
            imports.console.getElement("consoleButtons", addToolTip);
        }

        /*
         * Adds the buttons to toggle comfort level
         */
        function addToggle(plugin) {

            // creates the toggle menu item
            var toggle = new ui.item({
                type: "check",
                caption: "Less Comfortable",
                onclick: toggleSimpleMode
            });

            // creates divider below toggle
            divider = new ui.divider();

            // places it in View tab
            menus.addItemByPath("View/Less Comfortable", toggle, 0, plugin);
            menus.addItemByPath("View/Div", divider, 10, plugin);

            // Add preference pane button
            prefs.add({
               "CS50" : {
                    position: 5,
                    "IDE Behavior" : {
                        position: 10,
                        "Less Comfortable Mode" : {
                            type: "checkbox",
                            setting: "user/cs50/simple/@lessComfortable",
                            min: 1,
                            max: 200,
                            position: 190
                        },
                        "Mark Undeclared Variables" : {
                            type: "checkbox",
                            setting: "user/cs50/simple/@undeclaredVars",
                            min: 1,
                            max: 200,
                            position: 190
                        },
                        "Audible Terminal Bell" : {
                            type: "checkbox",
                            setting: "user/cs50/simple/@terminalSound",
                            min: 1,
                            max: 200,
                            position: 190
                        }
                    }
                }
            }, plugin);
        }

        /*
         * Show the CS50 IDE readme in a new tab when the "About CS50 IDE"
         * button is clicked
         */
        function displayReadme() {

            // Shows CS50 IDE readme
            tabManager.open(
                {
                    value      : "https://cs50.readme.io/",
                    editorType : "urlview",
                    active     : true,
                    document   : {title : "About CS50 IDE"},
                },
                function(err, tab) {
                    if (err) return err;
                }
            );
        }

        /*
         * Edit the "Cloud9" menu to be appropriately tailored to CS50 IDE
         */
        function loadMainMenuInfo(plugin) {

            // edits "Cloud9" main tab to display "CS50 IDE"
            menus.get("Cloud9").item.setAttribute("caption", "CS50 IDE");

            // creates the "About CS50 IDE" item
            var about = new ui.item({
                id     : "aboutCS50IDE",
                caption: "About CS50 IDE",
                onclick: displayReadme
            });

            // creates divider below toggle
            var div = new ui.divider();

            // places it in CS50 IDE tab
            menus.addItemByPath("Cloud9/About CS50 IDE", about, 0, plugin);
            menus.addItemByPath("Cloud9/Div", div, 10, plugin);

            // hide option as unneeded
            setMenuVisibility("Cloud9/Restart Cloud9", false);
        }

        /*
         * Locates user profile and assigns to global variable
         */
        function locateProfile() {

            // Locate current user's profile menu
            var bar = layout.findParent({ name: "preview" }).nextSibling;
            var profiles = bar.childNodes;
            for (var p in profiles) {
                if (profiles[p].$position == 600) {
                    profileMenu = profiles[p].submenu;
                    break;
                }
            }
        }

        /*
         * New logout function, redirects to appropriate page
         */
        function customLogout() {

            // Logs out, then redirects to CS50 login page
            auth.logout();
            window.location.replace("https://cs50.io/web/login");
        }

        /*
         * Change logout to take back to dashboard rather than sign in
         */
        function editProfileMenu(plugin) {
            if (profileMenu === null) return;

            // Hide old log out
            profileMenu.lastChild.setAttribute("visible", false);

            // Create new log out ui item
            var newLogout = ui.item({
                id     : "newLogout",
                caption: "Log Out",
                tooltip: "Log Out",
                onclick: customLogout
            });

            // Place in submenu
            menus.addItemToMenu(profileMenu, newLogout, 1000, plugin);
        }

        /**
         * Updates items of "View > Font Size".
         */
        function updateFontSize() {
            /**
             * @return true if editor type of focused tab is ace or terminal.
             * false otherwise.
             */
            function isAvailable() {
                var editorType = tabManager.focussedTab.editor.type;
                return editorType === "ace" || editorType === "terminal";
            };

            // cache and delete keyboard shortcuts for largerfont & smallerfont
            var largerfontKeys = commands.commands.largerfont.bindKey;
            delete commands.commands.largerfont.bindKey;
            var smallerfontKeys = commands.commands.smallerfont.bindKey;
            delete commands.commands.smallerfont.bindKey;

            // command for increasing font sizes of ace and terminal
            commands.addCommand({
                name: "largerfonts",
                exec: function() {

                    // increase ace's font size
                    commands.exec("largerfont");

                    // increase terminal's font size
                    var currSize = settings.getNumber(
                        "user/terminal/@fontsize"
                    );
                    settings.set(
                        "user/terminal/@fontsize",
                        ++currSize > 72 ? 72 : currSize
                    );
                },
                bindKey: largerfontKeys,
                isAvailable: isAvailable
            }, plugin);


            // command for resetting font sizes of ace and terminal to defaults
            commands.addCommand({
                name: "resetfonts",
                exec: function() {
                    var ace = 12;
                    var terminal = 12;

                    // determine default font sizes depending on current mode
                    if (presentation.presenting)
                        ace = terminal = 20;

                    // reset font sizes of ace and terminal to defaults
                    settings.set("user/ace/@fontSize", ace);
                    settings.set("user/terminal/@fontsize", terminal);
                },
                bindKey: {
                    mac: "Command-Ctrl-0",
                    win: "Alt-Ctrl-0"
                },
                isAvailable: isAvailable,
            }, plugin);

            // command for decreasing font sizes of ace and terminal
            commands.addCommand({
                name: "smallerfonts",
                exec: function() {

                    // decrease ace's font size
                    commands.exec("smallerfont");

                    // decrease terminal's font size
                    var currSize = settings.getNumber(
                        "user/terminal/@fontsize"
                    );
                    settings.set(
                        "user/terminal/@fontsize",
                        --currSize < 1 ? 1 : currSize
                    );
                },
                bindKey: smallerfontKeys,
                isAvailable: isAvailable
            }, plugin);

            // override behaviors of "Increase Font Size" & "Decrease Font Size"
            menus.get("View/Font Size/Increase Font Size").item.setAttribute(
                "command", "largerfonts"
            );
            menus.get("View/Font Size/Decrease Font Size").item.setAttribute(
                "command", "smallerfonts"
            );

            // add "Reset Font Size"
            menus.addItemByPath("View/Font Size/Reset Font Size", new ui.item({
                command: "resetfonts",
            }), 150, plugin);
        }

        /*
         * Toggles whether or not simple mode is enabled
         */
        function toggleSimpleMode(override) {

            // if we're unloading, remove menu customizations but don't save
            if (typeof override === "boolean")
                lessComfortable = override;
            else {
                // Toggles comfort level
                lessComfortable = !lessComfortable;
                settings.set("user/cs50/simple/@lessComfortable", lessComfortable);
            }

            // Toggles features
            toggleMenus(lessComfortable);
            togglePreview(lessComfortable);
            toggleMiniButton(lessComfortable);
            toggleSideTabs(lessComfortable);
            togglePlus(lessComfortable);

            // Makes sure that the checkbox is correct
            menus.get("View/Less Comfortable").item.checked = lessComfortable;
        }

        /*
         * Set the Terminal tab title to the current working directory
         */
        function setTmuxTitle(tab){
            // check if the tab exists and it is a terminal tab
            if (tab && tab.editorType === "terminal") {
                var session = tab.document.getSession();
                tab.document.on("setTitle", function(e) {
                    // fetch title from the object, fall back on tab
                    var title = e.title || tab.document.title;

                    // remove terminating ' - ""', if it exists
                    var re = /\s-\s""\s*$/;
                    if (title && re.test(title)) {
                        title = title.replace(re, "");

                        // list of items whose title should change
                        var docList = [e, tab.document];

                        if (session && session.hasOwnProperty("doc"))
                            docList.push(session.doc, session.doc.tooltip);

                        // fix all titles
                        docList.forEach(function (doc) {
                            if (doc.hasOwnProperty("title"))
                                doc.title = title;
                        });
                    }
                }, plugin);
            }
        }

        /*
         * Set the HTML page title based on a tab's title
         */
        function updateTitle(tab) {
            document.title = tab && settings.getBool("user/tabs/@title") && tab.title
                ? tab.title + " - CS50 IDE"
                : c9.projectName + " - CS50 IDE";
        }

        /*
         * Set all Terminal tab titles and HTML document title based on tab
         */
        function setTitlesFromTabs() {
            // set terminal titles and document title based on existing tabs
            tabManager.getTabs().forEach(function(tab) {
                setTmuxTitle(tab);
            });


            // future tabs
            tabManager.on("open", function wait(e) {
                setTmuxTitle(e.tab);
            }, plugin);

            // udpate document title once
            updateTitle(tabManager.focussedTab);

            // update document title when tabs change
            tabManager.on("focusSync", function(e){ updateTitle(e.tab); });
            tabManager.on("tabDestroy", function(e){ if (e.last) updateTitle(); });
            settings.on("user/tabs", function(){ updateTitle(tabManager.focussedTab); });
        }

        /*
         * Removes old sound found in init file
         */
        function removeSoundFromInit() {
            // Get the old sound which was updated in the init file
            var oldSound = require('text!./templates/beepsound.templates');

            // Get the contents of the init file
            var initJSContent = String(settings.get("user/config/init.js"));

            // Replace the old sound found in the init file with empty string
            initJSContent = initJSContent.replace(oldSound, "");

            // Set the init file to be the contents of the old init file minus the old sound
            settings.set("user/config/init.js", initJSContent);
        }

        /*
         * Adds a beep sound to the terminal.
         */
        function addSoundToTerminal() {
            var libterm = require("plugins/c9.ide.terminal/aceterm/libterm").prototype;
            if (settings.getBool("user/cs50/simple/@terminalSound") === true) {
                libterm.bell = function() { terminalBellObj.play(); };
            }
            else {
                libterm.bell = function() {};
            }
        }

        /**
         * Syncs tree toggle button and menu item with tree visibility state.
         *
         * @param {boolean} active whether to toggle the buttons on
         */
        function syncTreeToggles(active) {
            if (!treeToggle || !treeToggleItem)
                return;

            var style = "simple50-tree-toggle";
            if (dark)
                style += " dark";

            if (active === true) {
                style += " active";

                // check menu item
                treeToggleItem.setAttribute("checked", true);
            }
            else {
                // uncheck menu item
                treeToggleItem.setAttribute("checked", false);
            }

            // update style of tree-toggle button
            treeToggle.setAttribute("class", style);
        }

        /**
         * Hides workspace button and adds small toggle to the left of code tabs
         * and a menu toggle item under view.
         */
        function addTreeToggles() {
            // get current skin initially
            dark = settings.get("user/general/@skin").indexOf("dark") > -1;

            // remember if tree is shown or hidden initially
            var resetVisibility = tree.active ? tree.show : tree.hide;

            // hide workspace from window menu
            setMenuVisibility("Window/Workspace", false);

            // remove workspace from left bar
            panels.disablePanel("tree");

            // reset tree visibility status (to prevent disablePanel from hiding tree)
            resetVisibility("tree");

            // create toggle button
            treeToggle = ui.button({
                id: "treeToggle",
                "class": "simple50-tree-toggle",
                command: "toggletree",
                skin: "c9-simple-btn",
                height: 16,
                width: 16
            });

            // create menu item
            treeToggleItem = new ui.item({
                type: "check",
                caption: "File Browser",
                command: "toggletree"
            });

            // listen for pane creation
            tabManager.on("paneCreate", function(e) {
                var pane = e.pane;
                if (pane !== tabManager.getPanes()[0])
                    return;

                // make room for tree-toggle button
                pane.aml.$ext.classList.add("simple50-pane0");
                pane.aml.$buttons.style.paddingLeft = "54px";

                // insert tree-toggle button
                pane.aml.appendChild(treeToggle);
            });

            // add menu item to toggle tree (useful when toggle is hidden)
            menus.addItemByPath("View/File Browser", treeToggleItem, 200, plugin);

            // sync tree toggles as tree is toggled or skin is changed
            tree.once("draw", syncTreeToggles.bind(this, true));
            tree.on("show", syncTreeToggles.bind(this, true));
            tree.on("hide", syncTreeToggles);
            settings.on("user/general/@skin", function(skin) {
                dark = skin.indexOf("dark") > -1;
                syncTreeToggles(tree.active);
            });

            // toggle visibility of tree toggle as tabs are shown or hidden
            settings.on("user/tabs/@show", function(showing) {
                treeToggle.setAttribute("visible", showing);
            });

            // style tree-toggle initially
            syncTreeToggles(tree.active);
        }

        /**
         * Toggles avatar between Gravatar and C9 logo
         *
         * @param show whether to show Gravatar
         */
        function toggleGravatar(show) {
            if (typeof show !== "boolean")
                return;

            if (avatar && avatar.$ext) {
                // switch between Gravatar and C9 logo
                if (show)
                    avatar.$ext.classList.remove("c9-logo");
                else
                    avatar.$ext.classList.add("c9-logo");
            }
        }

        /*
         * Hides avatar in offline IDE. Adds preference to toggle between
         * Gravatar and C9 logo in online IDE only.
         *
         * @param err ideally passed by info.getUser in case of an error
         * @param user a user object with properties id and email
         */
        function addGravatarToggle(err, user) {
            if (err)
                return;

            if (user && user.id && user.email) {
                // get avatar button
                avatar = menus.get("user_" + user.id).item;
                if (!avatar)
                    return;

                // hide avatar in offline IDE
                if (!c9.hosted) {
                    avatar.setAttribute("visible", false);
                    return;
                }

                // add toggle in preferences
                prefs.add({
                   "CS50" : {
                        position: 5,
                        "IDE Behavior" : {
                            position: 10,
                            "Gravatar" : {
                                type: "checkbox",
                                setting: "user/cs50/simple/@gravatar",
                                min: 1,
                                max: 200,
                                position: 190
                            }
                        }
                    }
                }, plugin);

                // retrieve initial gravatar setting
                toggleGravatar(settings.getBool("user/cs50/simple/@gravatar"));

                // handle toggling gravatar setting
                settings.on("user/cs50/simple/@gravatar", toggleGravatar);
            }
        }

        /*
         * Function that will rename "Quit Cloud9" menu button to "Log Out" in Online IDEs
         */

        function renameQuitCloud9() {
            var item = menus.get("Cloud9/Quit Cloud9").item;

            if (item === undefined)
                return;

            item.setAttribute("caption", "Log Out");
        }

        /*
         * Function that will move the "Go To Your Dashboard" Menu Item below divider
         * If offline IDE it removes the "Go To Your Dashboard" item
         */

         function moveGoToYourDashboard() {
            if (!c9.hosted){
                menus.remove("Cloud9/Go To Your Dashboard");
            } else {
                menus.addItemByPath("Cloud9/Go To Your Dashboard", menus.get("Cloud9/Go To Your Dashboard").item, 2000060, plugin);
            }
         }

        /*
         * Function to rearrange the "File/New From Template" menu.
         * Cannot be placed within simple mode toggles.
         */
        function redoNewFromTemplateMenu() {
            var location = 100;
            [
                "File/New From Template/Clojure file",
                "File/New From Template/CoffeeScript file",
                "File/New From Template/CSS file",
                "File/New From Template/Express file",
                "File/New From Template/HTML file",
                "File/New From Template/JavaScript file",
                "File/New From Template/LESS file",
                "File/New From Template/Markdown",
                "File/New From Template/Node.js web server",
                "File/New From Template/Markdown",
                "File/New From Template/OCaml file",
                "File/New From Template/PHP file",
                "File/New From Template/Python file",
                "File/New From Template/Ruby file",
                "File/New From Template/SCSS file",
                "File/New From Template/SVG file",
                "File/New From Template/Text file",
                "File/New From Template/XML file",
                "File/New From Template/XQuery file"
            ].forEach(function(path) {
                moveMenuItem(path, path, location++);
            });
        }

        function getMenuItem(path) {
            var menu = menus.get(path);
            if (menu && menu.item)
                return menu.item;
            return null;
        }

        function moveMenuItem(currentPath, newPath, newLocation) {
            var newMenuItem = getMenuItem(currentPath);
            if (newMenuItem !== null) {
                menus.addItemByPath(newPath, newMenuItem, newLocation, plugin);
            }
        }

        function recaptionMenuItem(path, newCaption) {
            var newMenuItem = getMenuItem(path);
            if (newMenuItem !== null) {
                newMenuItem.setAttribute("caption", newCaption);
            }
        }
        /***** Initialization *****/

        var loaded = false;
        function load() {
            if (loaded)
               return false;
            loaded = true;

            // preload terminalSound
            terminalBellObj = new Audio(terminalSound);

            // Adds the permanent changes
            addToggle(plugin);
            addTooltips();
            updateFontSize();
            locateProfile();
            loadMainMenuInfo(plugin);
            editProfileMenu(plugin);
            setTitlesFromTabs();
            removeSoundFromInit();
            addSoundToTerminal();
            renameQuitCloud9();
            addTreeToggles();

            ui.insertCss(require("text!./style.css"), options.staticPrefix, plugin);

            var ver = settings.getNumber("user/cs50/simple/@ver");
            if (isNaN(ver) || ver < SETTINGS_VER) {
                // hide asterisks for unsaved documents
                settings.set("user/tabs/@asterisk", false);

                // Turn off auto-save by default
                settings.set("user/general/@autosave", false);

                // disable autocomplete (temporarily?)
                settings.set("user/language/@continuousCompletion", false);
                settings.set("user/language/@enterCompletion", false);

                // download project as ZIP files by default
                settings.set("user/general/@downloadFilesAs", "zip");

                settings.set("user/cs50/simple/@ver", SETTINGS_VER);
                // changes the vertical line to 132
                settings.set("user/ace/@printMarginColumn", "132");

                // default excluded formats
                var types = ["class", "exe", "gz", "o", "pdf", "pyc", "raw", "tar", "zip"];
                types.map(function (i) {
                    settings.set("user/tabs/editorTypes/@"+i, "none");
                });

                // Set Python default to Python 3
                settings.set("project/python/@version", "python3");

                // Set status bar to always show
                settings.set("user/ace/statusbar/@show", true);
            }

            settings.on("read", function(){
                settings.setDefaults("user/cs50/simple", [
                    ["lessComfortable", true],
                    ["undeclaredVars", true],
                    ["gravatar", false],
                    ["terminalSound", true]
                ]);
            });

            // When less comfortable option is changed
            settings.on("user/cs50/simple/@lessComfortable", function (saved) {
                if (saved != lessComfortable) {
                    menus.click("View/Less Comfortable");
                }
            }, plugin);

            redoNewFromTemplateMenu();

            toggleSimpleMode(settings.get("user/cs50/simple/@lessComfortable"));

            settings.on("write", function() {
                addSoundToTerminal();
            });

            // Add Gravatar toggle online only
            info.getUser(addGravatarToggle);

            moveGoToYourDashboard();
        }

        /***** Lifecycle *****/

        plugin.on("load", function(){
            load();
        });

        plugin.on("unload", function() {
            toggleSimpleMode(false);
            loaded = false;
            lessComfortable = false;
            profileMenu = null;
            divider = null;
            terminalBellObj = null;
            treeToggle = null;
            treeToggleItem = null;
            dark = null;
            avatar = null;
        });

        /***** Register and define API *****/

        /**
         * Left this empty since nobody else should be using our plugin
         **/
        plugin.freezePublicAPI({ });

        register(null, { "c9.ide.cs50.simple" : plugin });
    }
});
