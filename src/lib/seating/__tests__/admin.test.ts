import { describe, it, expect } from "vitest";
import { parseAdminReservation } from "../admin";

const base = {
  name: "Mme Martin",
  source: "PHONE",
  date: "2030-06-04",
  time: "19:30",
  guests: 4,
};

const ok = (body: unknown) => {
  const r = parseAdminReservation(body);
  if ("error" in r) throw new Error(r.error);
  return r.value;
};
const error = (body: unknown) => {
  const r = parseAdminReservation(body);
  return "error" in r ? r.error : null;
};

describe("parseAdminReservation", () => {
  it("accepte une réservation téléphonique minimale", () => {
    expect(ok(base)).toEqual({
      name: "Mme Martin",
      phone: null,
      email: null,
      date: "2030-06-04",
      time: "19:30",
      guests: 4,
      source: "PHONE",
      specialRequest: null,
      tableId: null,
      force: false,
    });
  });

  it("normalise téléphone, email et demande spéciale", () => {
    const v = ok({
      ...base,
      phone: " +33 6 12 34 56 78 ",
      email: " Martin@Example.COM ",
      specialRequest: " sans gluten ",
      force: true,
      tableId: 3,
    });
    expect(v).toMatchObject({
      phone: "+33 6 12 34 56 78",
      email: "martin@example.com",
      specialRequest: "sans gluten",
      force: true,
      tableId: 3,
    });
  });

  it("un client de passage n'a pas besoin de nom", () => {
    expect(ok({ ...base, source: "WALK_IN", name: "" }).name).toBe("Passage");
    expect(error({ ...base, name: "" })).toBe("Nom invalide");
  });

  it.each([
    [{ source: "WEB" }, "source invalide (PHONE ou WALK_IN)"],
    [{ source: undefined }, "source invalide (PHONE ou WALK_IN)"],
    [{ date: "04/06/2030" }, "Date invalide"],
    [{ date: "2030-13-45" }, "Date invalide"],
    [{ time: "25:00" }, "Heure invalide"],
    [{ time: "7:30" }, "Heure invalide"],
    [{ guests: 0 }, "Nombre de couverts invalide (1 à 20)"],
    [{ guests: 21 }, "Nombre de couverts invalide (1 à 20)"],
    [{ guests: 2.5 }, "Nombre de couverts invalide (1 à 20)"],
    [{ guests: "4" }, "Nombre de couverts invalide (1 à 20)"],
    [{ phone: "abc" }, "Numéro de téléphone invalide"],
    [{ email: "pas-un-email" }, "Email invalide"],
    [{ tableId: 0 }, "tableId invalide"],
    [{ tableId: "3" }, "tableId invalide"],
    [{ force: "oui" }, "force invalide"],
  ])("rejette %j", (patch, message) => {
    expect(error({ ...base, ...patch })).toBe(message);
  });

  it("rejette un corps vide", () => {
    expect(error(null)).toBe("source invalide (PHONE ou WALK_IN)");
  });
});
