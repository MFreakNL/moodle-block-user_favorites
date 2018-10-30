// This file is part of Moodle - http://moodle.org/
//
// Moodle is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Moodle is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Moodle.  If not, see <http://www.gnu.org/licenses/>.

/**
 * Tested in Moodle 3.5
 *
 * @license   http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 *
 * @package moodle-block-user_favorites
 * @copyright 2018 MFreak.nl
 * @author    Luuk Verhoeven
 **/

/* eslint-disable no-unused-vars, no-unused-expressions,no-console, no-script-url */
define(['jquery', 'core/ajax', 'core/notification'], function ($, Ajax, Notification) {

    /**
     * Opts that are possible to set.
     *
     * @type {{id: number, debugjs: boolean}}
     */
    var opts = {
        debugjs: true,
        id     : 0,
        url    : '',
        hash   : '',
    };

    /**
     * Set options base on listed options
     * @param {object} options
     */
    var set_options = function (options) {
        "use strict";
        var key, vartype;
        for (key in opts) {
            if (opts.hasOwnProperty(key) && options.hasOwnProperty(key)) {

                // Casting to prevent errors.
                vartype = typeof opts[key];
                if (vartype === "boolean") {
                    opts[key] = Boolean(options[key]);
                } else if (vartype === 'number') {
                    opts[key] = Number(options[key]);
                } else if (vartype === 'string') {
                    opts[key] = String(options[key]);
                }
                // Skip all other types.
            }
        }
    };

    /**
     * Console log debug wrapper.
     */
    var debug = {};

    /**
     * Set debug mode
     * Should only be enabled if site is in debug mode.
     * @param {boolean} isenabled
     */
    var set_debug = function (isenabled) {

        if (isenabled) {
            for (var m in console) {
                if (typeof console[m] == 'function') {
                    debug[m] = console[m].bind(window.console);
                }
            }
        } else {

            // Fake wrapper.
            for (var m in console) {
                if (typeof console[m] == 'function') {
                    debug[m] = function () {
                    };
                }
            }
        }
    };

    var favorites_module = {

        /**
         * Add or update a url
         *
         * @param {object} data
         * @param {string} title
         */
        set_url: function (data, title) {

            Notification.confirm(M.util.get_string('javascript:set_title', 'block_user_favorites'),
                '<input class="form-control" id="favorite-url" value="' + title + '">',
                M.util.get_string('javascript:yes', 'block_user_favorites'),
                M.util.get_string('javascript:no', 'block_user_favorites'), function () {

                    var request = Ajax.call([{
                        methodname: 'block_user_favorites_set_url',
                        args      : {
                            hash   : data.hash,
                            url    : data.url,
                            title  : $('#favorite-url').val(),
                            blockid: opts.id,
                        }
                    }]);

                    request[0].done(function (response) {
                        debug.log(response);
                        favorites_module.reload();
                    }).fail(Notification.exception);
                });
        },

        /**
         * Delete a url
         *
         * @param {object} data
         */
        delete: function (data) {

            var request = Ajax.call([{
                methodname: 'block_user_favorites_delete_url',
                args      : {
                    hash   : data.hash,
                    blockid: opts.id,
                }
            }]);

            request[0].done(function (response) {
                debug.log(response);
                favorites_module.reload();
            }).fail(Notification.exception);
        },

        /**
         * Reload the block
         */
        reload: function () {

            var request = Ajax.call([{
                methodname: 'block_user_favorites_content',
                args      : {
                    url    : opts.url,
                    blockid: opts.id,
                }
            }]);

            request[0].done(function (response) {
                debug.log(response);
                $('.block_user_favorites .content').html(response.content);
            }).fail(Notification.exception);
        },

        /**
         * Init event triggers.
         */
        init: function () {

            $('.block_user_favorites').on('click', '#block_user_favorites_set', function () {
                // Set current as favorite.
                favorites_module.set_url({
                    'hash': opts.hash,
                    'url' : opts.url
                }, $('title').text());

            }).on('click', '#block_user_favorites_delete', function () {
                // Delete current pages from favorites.
                favorites_module.delete({
                    'hash': opts.hash,
                });

            }).on('click', '.fa-remove', function () {
                // Remove a fav in the list.
                favorites_module.delete($(this).parent().parent().data());

            }).on('click', '.fa-edit', function () {
                // Edit a fav int the list.
                var data = $(this).parent().parent().data();
                favorites_module.set_url(data, $(this).parent().parent().find('a').text());
            });
        }
    };

    return {

        /**
         * Init.
         */
        initialise: function (args) {

            // Load the args passed from PHP.
            set_options(args);

            // Set internal debug console.
            set_debug(opts.debugjs);

            $.noConflict();
            $(document).ready(function () {
                debug.log('Block User Favorites v1.0');
                favorites_module.init();
            });
        }
    };
});