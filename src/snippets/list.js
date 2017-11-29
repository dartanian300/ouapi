list: function(site, deferred) {
    console.log("--listSnippets/Categories--");

    var protocol = "http:";
    var endpoint = /*protocol +*/ gadget.get('apihost') + '/snippets/list';
    var params = {
        authorization_token: gadget.get('token'), 

        site: site,
    };
    ajaxC({
        type: "GET",
        url: endpoint, 
        data: params,
        deferred: deferred
    });
    return deferred.promise();
}


/*
OUTPUT:
[
  [
    {
      "Main Content": [
        {
          "snippet": "Link List (2 columns)",
          "path": "/_resources/snippets/cantina_two_col.html",
          "description": "List of links with image and title"
        },
        {
          "snippet": "Link List (3 columns)",
          "path": "/_resources/snippets/cantina.html",
          "description": "List of links with image and title"
        },
        {
          "snippet": "Page Feature",
          "path": "/_resources/snippets/transmission_announcement.html",
          "description": "Page-wide gray bar with image, title, text and link"
        },
        {
          "snippet": "Preview (4 columns)",
          "path": "/_resources/snippets/fleet.html",
          "description": "Four column layout with linked image and text"
        },
        {
          "snippet": "Preview (1 column)",
          "path": "/_resources/snippets/fleet_onecol.html",
          "description": "One column layout with linked image and text"
        },
        {
          "snippet": "Show/Hide Accordion",
          "path": "/_resources/snippets/accordion.html",
          "description": "Show/Hide accordion with title and text content"
        },
        {
          "snippet": "Teaser",
          "path": "/_resources/snippets/teaser_w_photo.html",
          "description": "List of items each having a photo, title, description and optional links"
        },
        {
          "snippet": "Teaser (no image)",
          "path": "/_resources/snippets/teaser_no_photo.html",
          "description": "List of items each having a title, description and optional links"
        },
        {
          "snippet": "Button",
          "path": "/_resources/snippets/button.html",
          "description": "Clickable button with link"
        },
        {
          "snippet": "Table",
          "path": "/_resources/snippets/table.html",
          "description": "A simple table"
        },
        {
          "snippet": "Two-Column Layout",
          "path": "/_resources/snippets/two_columns.html",
          "description": "Splits a page into 2 columns"
        },
        {
          "snippet": "EMS Event Feed",
          "path": "/_resources/snippets/ksu_campus_cal.html",
          "description": "An event feed from EMS"
        },
        {
          "snippet": "Course Listing",
          "path": "/_resources/snippets/courses_listing.html",
          "description": "Lists all graduate and/or undergraduate courses for a given course prefix"
        },
        {
          "snippet": "Tumblr Feed",
          "path": "/_resources/snippets/tumblr_feed.html",
          "description": "Pulls content from a tumblr account and displays it"
        },
        {
          "snippet": "Preview (3 columns)",
          "path": "/_resources/snippets/fleet_threecol.html",
          "description": "Three column layout with linked image and text"
        },
        {
          "snippet": "Gold Header",
          "path": "/_resources/snippets/gold_header.html",
          "description": "A gold header"
        },
        {
          "snippet": "Twitter Feed",
          "path": "/_resources/snippets/twitter_feed.html",
          "description": "A twitter feed"
        },
        {
          "snippet": "Long List (Alphabetized)",
          "path": "/_resources/snippets/long_list_alphabetized.html",
          "description": "Automatically alphabetizes the content and outputs a zebra-striped list"
        },
        {
          "snippet": "Faculty/Staff Listing",
          "path": "/_resources/snippets/faculty_staff_listing.html",
          "description": "An alphabetical listing of faculty and staff"
        },
        {
          "snippet": "Academic Calendar",
          "path": "/_resources/snippets/academic_calendar.html",
          "description": "Pulls events from EMS to create an academic calendar for the year"
        },
        {
          "snippet": "Calendar Listing",
          "path": "/_resources/snippets/calendar_listing.html",
          "description": "A calendar listing of events from an OwlLife or Master Calendar RSS feed"
        },
        {
          "snippet": "Preview (2 columns)",
          "path": "/_resources/snippets/fleet_twocol.html",
          "description": "Two column layout with linked image and text"
        },
        {
          "snippet": "Heading with Link",
          "path": "/_resources/snippets/heading_with_link.html",
          "description": "A heading with a link beside it"
        }
      ]
    },
    {
      "Utility": [
        {
          "snippet": "Utility - Index List",
          "path": "/_resources/snippets/index-listing.html",
          "description": "Pulls section nav for overview page"
        },
        {
          "snippet": "Utility - Widgets Home",
          "path": "/_resources/snippets/modules.pcf",
          "description": "Complete Listing of All Modules / Widgets / Snippets"
        }
      ]
    },
    {
      "training": [
        {
          "snippet": "Teaser",
          "path": "/_resources/snippets/teaser_w_photo.html",
          "description": ""
        }
      ]
    },
    {
      "Blog": [
        {
          "snippet": "Image with Caption",
          "path": "/_resources/snippets/blog/img-caption.html",
          "description": ""
        },
        {
          "snippet": "Blog Posts By Category",
          "path": "/_resources/snippets/blog_posts_by_category.html",
          "description": "Pull blog posts based on a category"
        },
        {
          "snippet": "Blog Posts By Tag",
          "path": "/_resources/snippets/blog_posts_by_tag.html",
          "description": "Pull blog posts based on a tag"
        },
        {
          "snippet": "Blog Recent Posts",
          "path": "/_resources/snippets/blog_recent_posts.html",
          "description": "Pull recent posts"
        }
      ]
    },
    {
      "Sidebar": [
        {
          "snippet": "Feature",
          "path": "/_resources/snippets/tie_bomber.html",
          "description": "Gray content box"
        },
        {
          "snippet": "Link List",
          "path": "/_resources/snippets/tie_advanced.html",
          "description": "List of links with gold title"
        },
        {
          "snippet": "Social Media",
          "path": "/_resources/snippets/social_media.html",
          "description": "Displays your social media icons with links"
        },
        {
          "snippet": "Feature (no background)",
          "path": "/_resources/snippets/tie_fighter.html",
          "description": "Content box with blue title and no background"
        }
      ]
    },
    {
      "All Snippets": [
        {
          "snippet": "Utility - Widgets Home",
          "path": "/_resources/snippets/modules.pcf",
          "description": "Complete Listing of All Modules / Widgets / Snippets"
        },
        {
          "snippet": "Sidebar - Feature (no background)",
          "path": "/_resources/snippets/tie_fighter.inc",
          "description": "Content box with blue title and no background"
        },
        {
          "snippet": "Sidebar - Feature",
          "path": "/_resources/snippets/tie_bomber.html",
          "description": "Gray content box"
        },
        {
          "snippet": "Main Content - Link List (3 columns)",
          "path": "/_resources/snippets/cantina.html",
          "description": "List of links with image and title"
        },
        {
          "snippet": "Main Content - Preview (4 columns)",
          "path": "/_resources/snippets/fleet.html",
          "description": "Four column layout with linked image and text"
        },
        {
          "snippet": "Main Content - Link List (2 columns)",
          "path": "/_resources/snippets/cantina_two_col.html",
          "description": "List of links with image and title"
        },
        {
          "snippet": "ksu_group",
          "path": "/_resources/snippets/ksu_group.html",
          "description": "Use this table snippet to insert multiple snippets next to each other on a page. "
        },
        {
          "snippet": "Main Content - Teaser",
          "path": "/_resources/snippets/teaser_w_photo.html",
          "description": "??????\r\n\r\nTeaser element with photo. Use KSU Teaser Group Table Snippet to have proper formatting. Can be used on page by itself but will stretch the content. "
        },
        {
          "snippet": "Main Content - Teaser (no image)",
          "path": "/_resources/snippets/teaser_no_photo.html",
          "description": "???????\r\n\r\n\r\nTeaser element without a photo. Use KSU Teaser Group Table Snippet to have proper formatting. Can be used on page by itself but will stretch the content. "
        },
        {
          "snippet": "Sidebar - Link List",
          "path": "/_resources/snippets/tie_advanced.html",
          "description": "List of links with gold title"
        },
        {
          "snippet": "Home - User Groups",
          "path": "/_resources/snippets/user_groups.html",
          "description": "Six user group table for image, title and content link."
        },
        {
          "snippet": "Main Content - Page Feature",
          "path": "/_resources/snippets/transmission_announcement.html",
          "description": "Page-wide gray bar with image, title, text and link"
        },
        {
          "snippet": "Home - News Feed",
          "path": "/_resources/snippets/news_feed.html",
          "description": "Home Events feed table with title, url(rss feed.xml), number of items, category and section title/link. "
        },
        {
          "snippet": "Home - Events Feed",
          "path": "/_resources/snippets/events_feed.html",
          "description": "Home Events feed table with title, url(rss feed.xml), number of items, category and section title/link. "
        },
        {
          "snippet": "Home - Cantina",
          "path": "/_resources/snippets/home_cantina.html",
          "description": "Table with image, heading, short description and content link(read more) from the home page. "
        },
        {
          "snippet": "General - Button",
          "path": "/_resources/snippets/button.html",
          "description": "Clickable button with link"
        },
        {
          "snippet": "News - Landing RSS",
          "path": "/_resources/snippets/news_landing_feed.html",
          "description": "News Landing Page Feed. "
        },
        {
          "snippet": "News - Social Media Feature",
          "path": "/_resources/snippets/social_tie_bomber.html",
          "description": "Social tie bomber for news landing page."
        },
        {
          "snippet": "Main Content - Preview (1 column)",
          "path": "/_resources/snippets/fleet_onecol.html",
          "description": "One column layout with linked image and text"
        },
        {
          "snippet": "News - HootFeed RSS",
          "path": "/_resources/snippets/ksu_hootfeed.html",
          "description": "KSU Hoots. Feed widget from news landing page.. "
        },
        {
          "snippet": "News - Around Campus RSS",
          "path": "/_resources/snippets/ksu_campus_cal.html",
          "description": "KSU around campus calendar widget from news landing page. "
        },
        {
          "snippet": "Main Content - Show/Hide Accordion",
          "path": "/_resources/snippets/accordion.html",
          "description": "Show/Hide accordion with title and text content"
        },
        {
          "snippet": "Utility - Index List",
          "path": "/_resources/snippets/index-listing.html",
          "description": "Pulls section nav for overview page"
        }
      ]
    }
  ]
]
*/