# **dat-phase**

### dat-phase is chrome extension that automate the removal of liked video based on user provided filters such as keywords and channels with the ability to whitelist channels.

## **How to install?**

1. Download any of the releases or compile it yourself.
2. Move it to any directory that you usually don't interact with.
3. Open google chrome, click the three dots in the toolbar > More tools > Extensions. or just head directly to `chrome://extensions/`
4. Enable developer mode.
5. Load unpacked.
6. Locate the folder you extracted/compiled to where the `manifest.json` is located and press select folder.

## **How do i use it?**

The extension is almost straight forward. head to the extension settings. you will have access to a UI where you will find couple of noticeable user inputs.

## The Options

1. **Channels**: Here you insert any channel you want to remove your likes from. Please note it has to be 1:1 letter to letter with the same capitalization.

2. **Keywords**: Here you insert any keyword (case in-sensitive) you want the likes to remove if it was detected in the title. Please note there's 2 Modes to this input:

   1. **Sub-word**: The word you insert will stripped from any white spaces on both of its start and end. meaning when searching the word it will not care if the word is part of other word.
      eg: **Bat** In **Bat**tery, **Not** in K**not**. etc.

   2. **Full-Word**: the opposite of the first. but the word you insert will have two white spaces. one at the start and one and the end. meaning it will not be part of any other word (mostly).

   please note words who inserted in Full-Word mode will be distinguishable from other words by having it placed between two lines. such as **─Bat─**.

3. **Whitelisted Channels**: as the name suggest. here you add any channel you want to be unaffected by the filtration process.

4. **Delay**: The delay between checking for the next video when starting the automation process in milliseconds. the Recommended is any number between 300-700. any lower numbers can expose you to being rate limited.

5. **Filtration Method**: A Set of options on which way you want the filtration to operate upon. such only check keywords or channels or even both. there's also an option to only filter any non whitelisted channel or no filter at all. meaning all likes will be removed regardless of the provided filters.

6. **Import & Export Filters**: Here you can import and export filter data from & to json files.



## Importing Subscription
The extension provide you with the ability to import all of your subscribed channels and whitelist them. Simply head to [Youtube Subscription Page](https://www.youtube.com/feed/channels) and scroll to the bottom of the list and click on the extension's popup and import from there.

## Starting the extension 
To start the extension. Head to your [Youtube Liked Playlist](https://www.youtube.com/playlist?list=LL) and click the extension popup and start it from there. Note that any video get unliked will be listed on the extension popup window inside a list. and it can be downloaded.  
# Submitting your own filter.

Created your own filter and felt like it can be used by other community members? feel free to share it!

We have a [special repository](https://github.com/VincentDeAda/dat-phase-filters) for community filter with a a sample template to work with manually. 
