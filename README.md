# ShortcutsPreview

A Reddit/Discord bot for showing the details of Shortcuts when linked by their iCloud URL.

## Usage

After starting the script, you can use it in Reddit and Discord, depending on if the service was properly set up. There are also hosted versions available.

### Reddit

Allow the Reddit bot to detect posts by inviting the bot to the moderation team. It only uses the `posts` permission since it only needs it to sticky its preview comment, but it will work with no moderator permissions. The hosted version is [u/ShortcutsPreview](https://www.reddit.com/user/ShortcutsPreview/).

Link posts with a iCloud URL linking to a shortcut will be previewed, in the form of a possibly-stickied comment.

### Discord

The Discord bot needs three permissions to work:

* Read Messages
* Send Messages
* Send Links

The first iCloud URL found in a message is previewed with an embed message.
