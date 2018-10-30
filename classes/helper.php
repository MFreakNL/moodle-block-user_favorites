<?php
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
 * Helper class
 *
 * @license   http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 *
 * @package   moodle-block-user_favorites
 * @copyright 26-10-2018 MFreak.nl
 * @author    Luuk Verhoeven
 **/

namespace block_user_favorites;
defined('MOODLE_INTERNAL') || die;

class helper {

    /**
     * We are in DEBUG mode display more info than general.
     *
     * @return bool
     */
    public static function has_debugging_enabled() {
        global $CFG;

        // Check if the environment has debugging enabled.
        return ($CFG->debug >= 32767 && $CFG->debugdisplay == 1);
    }

}