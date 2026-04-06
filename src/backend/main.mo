import Array "mo:core/Array";
import Text "mo:core/Text";
import Iter "mo:core/Iter";
import Time "mo:core/Time";
import Int "mo:core/Int";
import Map "mo:core/Map";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";

actor {
  type ContactSubmission = {
    name : Text;
    email : Text;
    phone : ?Text;
    projectType : Text;
    message : Text;
    timestamp : Time.Time;
  };

  module ContactSubmission {
    public func compare(c1 : ContactSubmission, c2 : ContactSubmission) : Order.Order {
      Int.compare(c2.timestamp, c1.timestamp);
    };
  };

  type Testimonial = {
    clientName : Text;
    roleOrCompany : Text;
    quote : Text;
    rating : Int;
  };

  module Testimonial {
    public func compareByRating(t1 : Testimonial, t2 : Testimonial) : Order.Order {
      Int.compare(t2.rating, t1.rating);
    };
  };

  type PortfolioItem = {
    title : Text;
    description : Text;
    category : Text;
    imageUrl : Text;
    liveUrl : Text;
  };

  var nextContactId = 0;

  let contactSubmissions = Map.empty<Int, ContactSubmission>();

  let portfolioItems = Map.fromIter<Int, PortfolioItem>([(0, { title = "Corporate Website"; description = "Modern corporate site with custom CMS"; category = "Business"; imageUrl = "https://example.com/corp1.jpg"; liveUrl = "https://acmeinc.com" }), (1, { title = "E-commerce Store"; description = "Full-featured online store with cart"; category = "Commerce"; imageUrl = "https://example.com/shop1.jpg"; liveUrl = "https://shopworld.com" }), (2, { title = "Portfolio Site"; description = "Personal portfolio for designer"; category = "Portfolio"; imageUrl = "https://example.com/port1.jpg"; liveUrl = "https://designerpro.com" }), (3, { title = "Restaurant Website"; description = "Menu, reservations, online ordering"; category = "Food"; imageUrl = "https://example.com/food1.jpg"; liveUrl = "https://pizzahouse.com" })].values());

  let testimonials = Map.fromIter<Int, Testimonial>([(0, { clientName = "Sarah Miller"; roleOrCompany = "Marketing Director"; quote = "WebCrafters CP exceeded our expectations."; rating = 5 }), (1, { clientName = "James Lee"; roleOrCompany = "Small Business Owner"; quote = "Great communication and creative designs."; rating = 4 }), (2, { clientName = "Anna Kim"; roleOrCompany = "Freelancer"; quote = "Professional, reliable, and talented team!"; rating = 5 })].values());

  // Contact Submission

  public shared ({ caller }) func submitContactForm(name : Text, email : Text, phone : ?Text, projectType : Text, message : Text) : async Int {
    let id = nextContactId;
    let submission : ContactSubmission = {
      name;
      email;
      phone;
      projectType;
      message;
      timestamp = Time.now();
    };
    contactSubmissions.add(id, submission);
    nextContactId += 1;
    id;
  };

  public query ({ caller }) func getContactSubmission(id : Int) : async ContactSubmission {
    switch (contactSubmissions.get(id)) {
      case (null) { Runtime.trap("Contact submission does not exist.") };
      case (?submission) { submission };
    };
  };

  public query ({ caller }) func getAllContactSubmissions() : async [ContactSubmission] {
    contactSubmissions.values().toArray().sort(); // Sort by timestamp
  };

  // Portfolio

  public query ({ caller }) func getAllPortfolioItems() : async [PortfolioItem] {
    portfolioItems.values().toArray();
  };

  public query ({ caller }) func getPortfolioByCategory(category : Text) : async [PortfolioItem] {
    portfolioItems.values().toArray().filter(func(item) { Text.equal(item.category, category) });
  };

  public query ({ caller }) func searchPortfolioByTitle(searchTerm : Text) : async [PortfolioItem] {
    portfolioItems.values().toArray().filter(func(item) { item.title.contains(#text searchTerm) });
  };

  // Testimonials

  public query ({ caller }) func getAllTestimonials() : async [Testimonial] {
    testimonials.values().toArray().sort(Testimonial.compareByRating).reverse(); // Highest rating first
  };

  public query ({ caller }) func getTestimonialsByRating(rating : Int) : async [Testimonial] {
    testimonials.values().toArray().filter(func(t) { t.rating == rating });
  };

  public query ({ caller }) func getPortfolioItem(id : Int) : async PortfolioItem {
    switch (portfolioItems.get(id)) {
      case (null) { Runtime.trap("Portfolio item does not exist.") };
      case (?item) { item };
    };
  };
};
