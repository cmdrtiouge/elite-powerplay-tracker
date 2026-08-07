import streamDeck from "@elgato/streamdeck";

import { PowerPlayTracker } from "./actions/powerplay-button";

streamDeck.logger.setLevel("trace");

streamDeck.actions.registerAction(new PowerPlayTracker());

streamDeck.connect();