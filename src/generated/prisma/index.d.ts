
/**
 * Client
**/

import * as runtime from './runtime/client.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model Reservation
 * 
 */
export type Reservation = $Result.DefaultSelection<Prisma.$ReservationPayload>
/**
 * Model Admin
 * 
 */
export type Admin = $Result.DefaultSelection<Prisma.$AdminPayload>
/**
 * Model RestaurantSettings
 * 
 */
export type RestaurantSettings = $Result.DefaultSelection<Prisma.$RestaurantSettingsPayload>
/**
 * Model DayOverride
 * 
 */
export type DayOverride = $Result.DefaultSelection<Prisma.$DayOverridePayload>
/**
 * Model GiftCard
 * 
 */
export type GiftCard = $Result.DefaultSelection<Prisma.$GiftCardPayload>

/**
 * Enums
 */
export namespace $Enums {
  export const ReservationStatus: {
  PENDING_PAYMENT: 'PENDING_PAYMENT',
  CONFIRMED: 'CONFIRMED',
  CANCELLED: 'CANCELLED',
  COMPLETED: 'COMPLETED',
  IN_PROGRESS_PAYMENT: 'IN_PROGRESS_PAYMENT'
};

export type ReservationStatus = (typeof ReservationStatus)[keyof typeof ReservationStatus]


export const GiftCardStatus: {
  IN_PROGRESS_PAYMENT: 'IN_PROGRESS_PAYMENT',
  ACTIVE: 'ACTIVE',
  USED: 'USED',
  EXPIRED: 'EXPIRED'
};

export type GiftCardStatus = (typeof GiftCardStatus)[keyof typeof GiftCardStatus]

}

export type ReservationStatus = $Enums.ReservationStatus

export const ReservationStatus: typeof $Enums.ReservationStatus

export type GiftCardStatus = $Enums.GiftCardStatus

export const GiftCardStatus: typeof $Enums.GiftCardStatus

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient({
 *   adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL })
 * })
 * // Fetch zero or more Reservations
 * const reservations = await prisma.reservation.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://pris.ly/d/client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient({
   *   adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL })
   * })
   * // Fetch zero or more Reservations
   * const reservations = await prisma.reservation.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://pris.ly/d/client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/orm/prisma-client/queries/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>

  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.reservation`: Exposes CRUD operations for the **Reservation** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Reservations
    * const reservations = await prisma.reservation.findMany()
    * ```
    */
  get reservation(): Prisma.ReservationDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.admin`: Exposes CRUD operations for the **Admin** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Admins
    * const admins = await prisma.admin.findMany()
    * ```
    */
  get admin(): Prisma.AdminDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.restaurantSettings`: Exposes CRUD operations for the **RestaurantSettings** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more RestaurantSettings
    * const restaurantSettings = await prisma.restaurantSettings.findMany()
    * ```
    */
  get restaurantSettings(): Prisma.RestaurantSettingsDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.dayOverride`: Exposes CRUD operations for the **DayOverride** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more DayOverrides
    * const dayOverrides = await prisma.dayOverride.findMany()
    * ```
    */
  get dayOverride(): Prisma.DayOverrideDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.giftCard`: Exposes CRUD operations for the **GiftCard** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more GiftCards
    * const giftCards = await prisma.giftCard.findMany()
    * ```
    */
  get giftCard(): Prisma.GiftCardDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 7.8.0
   * Query Engine version: 3c6e192761c0362d496ed980de936e2f3cebcd3a
   */
  export type PrismaVersion = {
    client: string
    engine: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import Bytes = runtime.Bytes
  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    Reservation: 'Reservation',
    Admin: 'Admin',
    RestaurantSettings: 'RestaurantSettings',
    DayOverride: 'DayOverride',
    GiftCard: 'GiftCard'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]



  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "reservation" | "admin" | "restaurantSettings" | "dayOverride" | "giftCard"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      Reservation: {
        payload: Prisma.$ReservationPayload<ExtArgs>
        fields: Prisma.ReservationFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ReservationFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReservationPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ReservationFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReservationPayload>
          }
          findFirst: {
            args: Prisma.ReservationFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReservationPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ReservationFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReservationPayload>
          }
          findMany: {
            args: Prisma.ReservationFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReservationPayload>[]
          }
          create: {
            args: Prisma.ReservationCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReservationPayload>
          }
          createMany: {
            args: Prisma.ReservationCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ReservationCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReservationPayload>[]
          }
          delete: {
            args: Prisma.ReservationDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReservationPayload>
          }
          update: {
            args: Prisma.ReservationUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReservationPayload>
          }
          deleteMany: {
            args: Prisma.ReservationDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ReservationUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ReservationUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReservationPayload>[]
          }
          upsert: {
            args: Prisma.ReservationUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReservationPayload>
          }
          aggregate: {
            args: Prisma.ReservationAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateReservation>
          }
          groupBy: {
            args: Prisma.ReservationGroupByArgs<ExtArgs>
            result: $Utils.Optional<ReservationGroupByOutputType>[]
          }
          count: {
            args: Prisma.ReservationCountArgs<ExtArgs>
            result: $Utils.Optional<ReservationCountAggregateOutputType> | number
          }
        }
      }
      Admin: {
        payload: Prisma.$AdminPayload<ExtArgs>
        fields: Prisma.AdminFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AdminFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AdminPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AdminFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AdminPayload>
          }
          findFirst: {
            args: Prisma.AdminFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AdminPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AdminFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AdminPayload>
          }
          findMany: {
            args: Prisma.AdminFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AdminPayload>[]
          }
          create: {
            args: Prisma.AdminCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AdminPayload>
          }
          createMany: {
            args: Prisma.AdminCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AdminCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AdminPayload>[]
          }
          delete: {
            args: Prisma.AdminDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AdminPayload>
          }
          update: {
            args: Prisma.AdminUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AdminPayload>
          }
          deleteMany: {
            args: Prisma.AdminDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AdminUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.AdminUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AdminPayload>[]
          }
          upsert: {
            args: Prisma.AdminUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AdminPayload>
          }
          aggregate: {
            args: Prisma.AdminAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAdmin>
          }
          groupBy: {
            args: Prisma.AdminGroupByArgs<ExtArgs>
            result: $Utils.Optional<AdminGroupByOutputType>[]
          }
          count: {
            args: Prisma.AdminCountArgs<ExtArgs>
            result: $Utils.Optional<AdminCountAggregateOutputType> | number
          }
        }
      }
      RestaurantSettings: {
        payload: Prisma.$RestaurantSettingsPayload<ExtArgs>
        fields: Prisma.RestaurantSettingsFieldRefs
        operations: {
          findUnique: {
            args: Prisma.RestaurantSettingsFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RestaurantSettingsPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.RestaurantSettingsFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RestaurantSettingsPayload>
          }
          findFirst: {
            args: Prisma.RestaurantSettingsFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RestaurantSettingsPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.RestaurantSettingsFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RestaurantSettingsPayload>
          }
          findMany: {
            args: Prisma.RestaurantSettingsFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RestaurantSettingsPayload>[]
          }
          create: {
            args: Prisma.RestaurantSettingsCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RestaurantSettingsPayload>
          }
          createMany: {
            args: Prisma.RestaurantSettingsCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.RestaurantSettingsCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RestaurantSettingsPayload>[]
          }
          delete: {
            args: Prisma.RestaurantSettingsDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RestaurantSettingsPayload>
          }
          update: {
            args: Prisma.RestaurantSettingsUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RestaurantSettingsPayload>
          }
          deleteMany: {
            args: Prisma.RestaurantSettingsDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.RestaurantSettingsUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.RestaurantSettingsUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RestaurantSettingsPayload>[]
          }
          upsert: {
            args: Prisma.RestaurantSettingsUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RestaurantSettingsPayload>
          }
          aggregate: {
            args: Prisma.RestaurantSettingsAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateRestaurantSettings>
          }
          groupBy: {
            args: Prisma.RestaurantSettingsGroupByArgs<ExtArgs>
            result: $Utils.Optional<RestaurantSettingsGroupByOutputType>[]
          }
          count: {
            args: Prisma.RestaurantSettingsCountArgs<ExtArgs>
            result: $Utils.Optional<RestaurantSettingsCountAggregateOutputType> | number
          }
        }
      }
      DayOverride: {
        payload: Prisma.$DayOverridePayload<ExtArgs>
        fields: Prisma.DayOverrideFieldRefs
        operations: {
          findUnique: {
            args: Prisma.DayOverrideFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DayOverridePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.DayOverrideFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DayOverridePayload>
          }
          findFirst: {
            args: Prisma.DayOverrideFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DayOverridePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.DayOverrideFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DayOverridePayload>
          }
          findMany: {
            args: Prisma.DayOverrideFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DayOverridePayload>[]
          }
          create: {
            args: Prisma.DayOverrideCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DayOverridePayload>
          }
          createMany: {
            args: Prisma.DayOverrideCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.DayOverrideCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DayOverridePayload>[]
          }
          delete: {
            args: Prisma.DayOverrideDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DayOverridePayload>
          }
          update: {
            args: Prisma.DayOverrideUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DayOverridePayload>
          }
          deleteMany: {
            args: Prisma.DayOverrideDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.DayOverrideUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.DayOverrideUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DayOverridePayload>[]
          }
          upsert: {
            args: Prisma.DayOverrideUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DayOverridePayload>
          }
          aggregate: {
            args: Prisma.DayOverrideAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateDayOverride>
          }
          groupBy: {
            args: Prisma.DayOverrideGroupByArgs<ExtArgs>
            result: $Utils.Optional<DayOverrideGroupByOutputType>[]
          }
          count: {
            args: Prisma.DayOverrideCountArgs<ExtArgs>
            result: $Utils.Optional<DayOverrideCountAggregateOutputType> | number
          }
        }
      }
      GiftCard: {
        payload: Prisma.$GiftCardPayload<ExtArgs>
        fields: Prisma.GiftCardFieldRefs
        operations: {
          findUnique: {
            args: Prisma.GiftCardFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GiftCardPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.GiftCardFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GiftCardPayload>
          }
          findFirst: {
            args: Prisma.GiftCardFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GiftCardPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.GiftCardFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GiftCardPayload>
          }
          findMany: {
            args: Prisma.GiftCardFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GiftCardPayload>[]
          }
          create: {
            args: Prisma.GiftCardCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GiftCardPayload>
          }
          createMany: {
            args: Prisma.GiftCardCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.GiftCardCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GiftCardPayload>[]
          }
          delete: {
            args: Prisma.GiftCardDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GiftCardPayload>
          }
          update: {
            args: Prisma.GiftCardUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GiftCardPayload>
          }
          deleteMany: {
            args: Prisma.GiftCardDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.GiftCardUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.GiftCardUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GiftCardPayload>[]
          }
          upsert: {
            args: Prisma.GiftCardUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GiftCardPayload>
          }
          aggregate: {
            args: Prisma.GiftCardAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateGiftCard>
          }
          groupBy: {
            args: Prisma.GiftCardGroupByArgs<ExtArgs>
            result: $Utils.Optional<GiftCardGroupByOutputType>[]
          }
          count: {
            args: Prisma.GiftCardCountArgs<ExtArgs>
            result: $Utils.Optional<GiftCardCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://pris.ly/d/logging).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Instance of a Driver Adapter, e.g., like one provided by `@prisma/adapter-planetscale`
     */
    adapter?: runtime.SqlDriverAdapterFactory
    /**
     * Prisma Accelerate URL allowing the client to connect through Accelerate instead of a direct database.
     */
    accelerateUrl?: string
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
    /**
     * SQL commenter plugins that add metadata to SQL queries as comments.
     * Comments follow the sqlcommenter format: https://google.github.io/sqlcommenter/
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   adapter,
     *   comments: [
     *     traceContext(),
     *     queryInsights(),
     *   ],
     * })
     * ```
     */
    comments?: runtime.SqlCommenterPlugin[]
  }
  export type GlobalOmitConfig = {
    reservation?: ReservationOmit
    admin?: AdminOmit
    restaurantSettings?: RestaurantSettingsOmit
    dayOverride?: DayOverrideOmit
    giftCard?: GiftCardOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */



  /**
   * Models
   */

  /**
   * Model Reservation
   */

  export type AggregateReservation = {
    _count: ReservationCountAggregateOutputType | null
    _avg: ReservationAvgAggregateOutputType | null
    _sum: ReservationSumAggregateOutputType | null
    _min: ReservationMinAggregateOutputType | null
    _max: ReservationMaxAggregateOutputType | null
  }

  export type ReservationAvgAggregateOutputType = {
    guests: number | null
  }

  export type ReservationSumAggregateOutputType = {
    guests: number | null
  }

  export type ReservationMinAggregateOutputType = {
    id: string | null
    createdAt: Date | null
    updatedAt: Date | null
    name: string | null
    email: string | null
    phone: string | null
    date: Date | null
    guests: number | null
    specialRequest: string | null
    wantsSmsReminder: boolean | null
    status: $Enums.ReservationStatus | null
    stripeSessionId: string | null
    expiresAt: Date | null
    transactionExpireAt: Date | null
    reminderEmailSent: boolean | null
    reminderSmsSent: boolean | null
    cancelToken: string | null
  }

  export type ReservationMaxAggregateOutputType = {
    id: string | null
    createdAt: Date | null
    updatedAt: Date | null
    name: string | null
    email: string | null
    phone: string | null
    date: Date | null
    guests: number | null
    specialRequest: string | null
    wantsSmsReminder: boolean | null
    status: $Enums.ReservationStatus | null
    stripeSessionId: string | null
    expiresAt: Date | null
    transactionExpireAt: Date | null
    reminderEmailSent: boolean | null
    reminderSmsSent: boolean | null
    cancelToken: string | null
  }

  export type ReservationCountAggregateOutputType = {
    id: number
    createdAt: number
    updatedAt: number
    name: number
    email: number
    phone: number
    date: number
    guests: number
    specialRequest: number
    wantsSmsReminder: number
    status: number
    stripeSessionId: number
    expiresAt: number
    transactionExpireAt: number
    reminderEmailSent: number
    reminderSmsSent: number
    cancelToken: number
    _all: number
  }


  export type ReservationAvgAggregateInputType = {
    guests?: true
  }

  export type ReservationSumAggregateInputType = {
    guests?: true
  }

  export type ReservationMinAggregateInputType = {
    id?: true
    createdAt?: true
    updatedAt?: true
    name?: true
    email?: true
    phone?: true
    date?: true
    guests?: true
    specialRequest?: true
    wantsSmsReminder?: true
    status?: true
    stripeSessionId?: true
    expiresAt?: true
    transactionExpireAt?: true
    reminderEmailSent?: true
    reminderSmsSent?: true
    cancelToken?: true
  }

  export type ReservationMaxAggregateInputType = {
    id?: true
    createdAt?: true
    updatedAt?: true
    name?: true
    email?: true
    phone?: true
    date?: true
    guests?: true
    specialRequest?: true
    wantsSmsReminder?: true
    status?: true
    stripeSessionId?: true
    expiresAt?: true
    transactionExpireAt?: true
    reminderEmailSent?: true
    reminderSmsSent?: true
    cancelToken?: true
  }

  export type ReservationCountAggregateInputType = {
    id?: true
    createdAt?: true
    updatedAt?: true
    name?: true
    email?: true
    phone?: true
    date?: true
    guests?: true
    specialRequest?: true
    wantsSmsReminder?: true
    status?: true
    stripeSessionId?: true
    expiresAt?: true
    transactionExpireAt?: true
    reminderEmailSent?: true
    reminderSmsSent?: true
    cancelToken?: true
    _all?: true
  }

  export type ReservationAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Reservation to aggregate.
     */
    where?: ReservationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Reservations to fetch.
     */
    orderBy?: ReservationOrderByWithRelationInput | ReservationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ReservationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Reservations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Reservations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Reservations
    **/
    _count?: true | ReservationCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ReservationAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ReservationSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ReservationMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ReservationMaxAggregateInputType
  }

  export type GetReservationAggregateType<T extends ReservationAggregateArgs> = {
        [P in keyof T & keyof AggregateReservation]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateReservation[P]>
      : GetScalarType<T[P], AggregateReservation[P]>
  }




  export type ReservationGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ReservationWhereInput
    orderBy?: ReservationOrderByWithAggregationInput | ReservationOrderByWithAggregationInput[]
    by: ReservationScalarFieldEnum[] | ReservationScalarFieldEnum
    having?: ReservationScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ReservationCountAggregateInputType | true
    _avg?: ReservationAvgAggregateInputType
    _sum?: ReservationSumAggregateInputType
    _min?: ReservationMinAggregateInputType
    _max?: ReservationMaxAggregateInputType
  }

  export type ReservationGroupByOutputType = {
    id: string
    createdAt: Date
    updatedAt: Date
    name: string
    email: string
    phone: string | null
    date: Date
    guests: number
    specialRequest: string | null
    wantsSmsReminder: boolean
    status: $Enums.ReservationStatus
    stripeSessionId: string | null
    expiresAt: Date | null
    transactionExpireAt: Date | null
    reminderEmailSent: boolean
    reminderSmsSent: boolean
    cancelToken: string
    _count: ReservationCountAggregateOutputType | null
    _avg: ReservationAvgAggregateOutputType | null
    _sum: ReservationSumAggregateOutputType | null
    _min: ReservationMinAggregateOutputType | null
    _max: ReservationMaxAggregateOutputType | null
  }

  type GetReservationGroupByPayload<T extends ReservationGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ReservationGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ReservationGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ReservationGroupByOutputType[P]>
            : GetScalarType<T[P], ReservationGroupByOutputType[P]>
        }
      >
    >


  export type ReservationSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    name?: boolean
    email?: boolean
    phone?: boolean
    date?: boolean
    guests?: boolean
    specialRequest?: boolean
    wantsSmsReminder?: boolean
    status?: boolean
    stripeSessionId?: boolean
    expiresAt?: boolean
    transactionExpireAt?: boolean
    reminderEmailSent?: boolean
    reminderSmsSent?: boolean
    cancelToken?: boolean
  }, ExtArgs["result"]["reservation"]>

  export type ReservationSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    name?: boolean
    email?: boolean
    phone?: boolean
    date?: boolean
    guests?: boolean
    specialRequest?: boolean
    wantsSmsReminder?: boolean
    status?: boolean
    stripeSessionId?: boolean
    expiresAt?: boolean
    transactionExpireAt?: boolean
    reminderEmailSent?: boolean
    reminderSmsSent?: boolean
    cancelToken?: boolean
  }, ExtArgs["result"]["reservation"]>

  export type ReservationSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    name?: boolean
    email?: boolean
    phone?: boolean
    date?: boolean
    guests?: boolean
    specialRequest?: boolean
    wantsSmsReminder?: boolean
    status?: boolean
    stripeSessionId?: boolean
    expiresAt?: boolean
    transactionExpireAt?: boolean
    reminderEmailSent?: boolean
    reminderSmsSent?: boolean
    cancelToken?: boolean
  }, ExtArgs["result"]["reservation"]>

  export type ReservationSelectScalar = {
    id?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    name?: boolean
    email?: boolean
    phone?: boolean
    date?: boolean
    guests?: boolean
    specialRequest?: boolean
    wantsSmsReminder?: boolean
    status?: boolean
    stripeSessionId?: boolean
    expiresAt?: boolean
    transactionExpireAt?: boolean
    reminderEmailSent?: boolean
    reminderSmsSent?: boolean
    cancelToken?: boolean
  }

  export type ReservationOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "createdAt" | "updatedAt" | "name" | "email" | "phone" | "date" | "guests" | "specialRequest" | "wantsSmsReminder" | "status" | "stripeSessionId" | "expiresAt" | "transactionExpireAt" | "reminderEmailSent" | "reminderSmsSent" | "cancelToken", ExtArgs["result"]["reservation"]>

  export type $ReservationPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Reservation"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      createdAt: Date
      updatedAt: Date
      name: string
      email: string
      phone: string | null
      date: Date
      guests: number
      specialRequest: string | null
      wantsSmsReminder: boolean
      status: $Enums.ReservationStatus
      stripeSessionId: string | null
      expiresAt: Date | null
      transactionExpireAt: Date | null
      reminderEmailSent: boolean
      reminderSmsSent: boolean
      cancelToken: string
    }, ExtArgs["result"]["reservation"]>
    composites: {}
  }

  type ReservationGetPayload<S extends boolean | null | undefined | ReservationDefaultArgs> = $Result.GetResult<Prisma.$ReservationPayload, S>

  type ReservationCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ReservationFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ReservationCountAggregateInputType | true
    }

  export interface ReservationDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Reservation'], meta: { name: 'Reservation' } }
    /**
     * Find zero or one Reservation that matches the filter.
     * @param {ReservationFindUniqueArgs} args - Arguments to find a Reservation
     * @example
     * // Get one Reservation
     * const reservation = await prisma.reservation.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ReservationFindUniqueArgs>(args: SelectSubset<T, ReservationFindUniqueArgs<ExtArgs>>): Prisma__ReservationClient<$Result.GetResult<Prisma.$ReservationPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Reservation that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ReservationFindUniqueOrThrowArgs} args - Arguments to find a Reservation
     * @example
     * // Get one Reservation
     * const reservation = await prisma.reservation.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ReservationFindUniqueOrThrowArgs>(args: SelectSubset<T, ReservationFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ReservationClient<$Result.GetResult<Prisma.$ReservationPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Reservation that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReservationFindFirstArgs} args - Arguments to find a Reservation
     * @example
     * // Get one Reservation
     * const reservation = await prisma.reservation.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ReservationFindFirstArgs>(args?: SelectSubset<T, ReservationFindFirstArgs<ExtArgs>>): Prisma__ReservationClient<$Result.GetResult<Prisma.$ReservationPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Reservation that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReservationFindFirstOrThrowArgs} args - Arguments to find a Reservation
     * @example
     * // Get one Reservation
     * const reservation = await prisma.reservation.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ReservationFindFirstOrThrowArgs>(args?: SelectSubset<T, ReservationFindFirstOrThrowArgs<ExtArgs>>): Prisma__ReservationClient<$Result.GetResult<Prisma.$ReservationPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Reservations that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReservationFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Reservations
     * const reservations = await prisma.reservation.findMany()
     * 
     * // Get first 10 Reservations
     * const reservations = await prisma.reservation.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const reservationWithIdOnly = await prisma.reservation.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ReservationFindManyArgs>(args?: SelectSubset<T, ReservationFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ReservationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Reservation.
     * @param {ReservationCreateArgs} args - Arguments to create a Reservation.
     * @example
     * // Create one Reservation
     * const Reservation = await prisma.reservation.create({
     *   data: {
     *     // ... data to create a Reservation
     *   }
     * })
     * 
     */
    create<T extends ReservationCreateArgs>(args: SelectSubset<T, ReservationCreateArgs<ExtArgs>>): Prisma__ReservationClient<$Result.GetResult<Prisma.$ReservationPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Reservations.
     * @param {ReservationCreateManyArgs} args - Arguments to create many Reservations.
     * @example
     * // Create many Reservations
     * const reservation = await prisma.reservation.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ReservationCreateManyArgs>(args?: SelectSubset<T, ReservationCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Reservations and returns the data saved in the database.
     * @param {ReservationCreateManyAndReturnArgs} args - Arguments to create many Reservations.
     * @example
     * // Create many Reservations
     * const reservation = await prisma.reservation.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Reservations and only return the `id`
     * const reservationWithIdOnly = await prisma.reservation.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ReservationCreateManyAndReturnArgs>(args?: SelectSubset<T, ReservationCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ReservationPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Reservation.
     * @param {ReservationDeleteArgs} args - Arguments to delete one Reservation.
     * @example
     * // Delete one Reservation
     * const Reservation = await prisma.reservation.delete({
     *   where: {
     *     // ... filter to delete one Reservation
     *   }
     * })
     * 
     */
    delete<T extends ReservationDeleteArgs>(args: SelectSubset<T, ReservationDeleteArgs<ExtArgs>>): Prisma__ReservationClient<$Result.GetResult<Prisma.$ReservationPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Reservation.
     * @param {ReservationUpdateArgs} args - Arguments to update one Reservation.
     * @example
     * // Update one Reservation
     * const reservation = await prisma.reservation.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ReservationUpdateArgs>(args: SelectSubset<T, ReservationUpdateArgs<ExtArgs>>): Prisma__ReservationClient<$Result.GetResult<Prisma.$ReservationPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Reservations.
     * @param {ReservationDeleteManyArgs} args - Arguments to filter Reservations to delete.
     * @example
     * // Delete a few Reservations
     * const { count } = await prisma.reservation.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ReservationDeleteManyArgs>(args?: SelectSubset<T, ReservationDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Reservations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReservationUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Reservations
     * const reservation = await prisma.reservation.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ReservationUpdateManyArgs>(args: SelectSubset<T, ReservationUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Reservations and returns the data updated in the database.
     * @param {ReservationUpdateManyAndReturnArgs} args - Arguments to update many Reservations.
     * @example
     * // Update many Reservations
     * const reservation = await prisma.reservation.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Reservations and only return the `id`
     * const reservationWithIdOnly = await prisma.reservation.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ReservationUpdateManyAndReturnArgs>(args: SelectSubset<T, ReservationUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ReservationPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Reservation.
     * @param {ReservationUpsertArgs} args - Arguments to update or create a Reservation.
     * @example
     * // Update or create a Reservation
     * const reservation = await prisma.reservation.upsert({
     *   create: {
     *     // ... data to create a Reservation
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Reservation we want to update
     *   }
     * })
     */
    upsert<T extends ReservationUpsertArgs>(args: SelectSubset<T, ReservationUpsertArgs<ExtArgs>>): Prisma__ReservationClient<$Result.GetResult<Prisma.$ReservationPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Reservations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReservationCountArgs} args - Arguments to filter Reservations to count.
     * @example
     * // Count the number of Reservations
     * const count = await prisma.reservation.count({
     *   where: {
     *     // ... the filter for the Reservations we want to count
     *   }
     * })
    **/
    count<T extends ReservationCountArgs>(
      args?: Subset<T, ReservationCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ReservationCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Reservation.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReservationAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ReservationAggregateArgs>(args: Subset<T, ReservationAggregateArgs>): Prisma.PrismaPromise<GetReservationAggregateType<T>>

    /**
     * Group by Reservation.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReservationGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ReservationGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ReservationGroupByArgs['orderBy'] }
        : { orderBy?: ReservationGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ReservationGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetReservationGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Reservation model
   */
  readonly fields: ReservationFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Reservation.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ReservationClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Reservation model
   */
  interface ReservationFieldRefs {
    readonly id: FieldRef<"Reservation", 'String'>
    readonly createdAt: FieldRef<"Reservation", 'DateTime'>
    readonly updatedAt: FieldRef<"Reservation", 'DateTime'>
    readonly name: FieldRef<"Reservation", 'String'>
    readonly email: FieldRef<"Reservation", 'String'>
    readonly phone: FieldRef<"Reservation", 'String'>
    readonly date: FieldRef<"Reservation", 'DateTime'>
    readonly guests: FieldRef<"Reservation", 'Int'>
    readonly specialRequest: FieldRef<"Reservation", 'String'>
    readonly wantsSmsReminder: FieldRef<"Reservation", 'Boolean'>
    readonly status: FieldRef<"Reservation", 'ReservationStatus'>
    readonly stripeSessionId: FieldRef<"Reservation", 'String'>
    readonly expiresAt: FieldRef<"Reservation", 'DateTime'>
    readonly transactionExpireAt: FieldRef<"Reservation", 'DateTime'>
    readonly reminderEmailSent: FieldRef<"Reservation", 'Boolean'>
    readonly reminderSmsSent: FieldRef<"Reservation", 'Boolean'>
    readonly cancelToken: FieldRef<"Reservation", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Reservation findUnique
   */
  export type ReservationFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Reservation
     */
    select?: ReservationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Reservation
     */
    omit?: ReservationOmit<ExtArgs> | null
    /**
     * Filter, which Reservation to fetch.
     */
    where: ReservationWhereUniqueInput
  }

  /**
   * Reservation findUniqueOrThrow
   */
  export type ReservationFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Reservation
     */
    select?: ReservationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Reservation
     */
    omit?: ReservationOmit<ExtArgs> | null
    /**
     * Filter, which Reservation to fetch.
     */
    where: ReservationWhereUniqueInput
  }

  /**
   * Reservation findFirst
   */
  export type ReservationFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Reservation
     */
    select?: ReservationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Reservation
     */
    omit?: ReservationOmit<ExtArgs> | null
    /**
     * Filter, which Reservation to fetch.
     */
    where?: ReservationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Reservations to fetch.
     */
    orderBy?: ReservationOrderByWithRelationInput | ReservationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Reservations.
     */
    cursor?: ReservationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Reservations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Reservations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Reservations.
     */
    distinct?: ReservationScalarFieldEnum | ReservationScalarFieldEnum[]
  }

  /**
   * Reservation findFirstOrThrow
   */
  export type ReservationFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Reservation
     */
    select?: ReservationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Reservation
     */
    omit?: ReservationOmit<ExtArgs> | null
    /**
     * Filter, which Reservation to fetch.
     */
    where?: ReservationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Reservations to fetch.
     */
    orderBy?: ReservationOrderByWithRelationInput | ReservationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Reservations.
     */
    cursor?: ReservationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Reservations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Reservations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Reservations.
     */
    distinct?: ReservationScalarFieldEnum | ReservationScalarFieldEnum[]
  }

  /**
   * Reservation findMany
   */
  export type ReservationFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Reservation
     */
    select?: ReservationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Reservation
     */
    omit?: ReservationOmit<ExtArgs> | null
    /**
     * Filter, which Reservations to fetch.
     */
    where?: ReservationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Reservations to fetch.
     */
    orderBy?: ReservationOrderByWithRelationInput | ReservationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Reservations.
     */
    cursor?: ReservationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Reservations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Reservations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Reservations.
     */
    distinct?: ReservationScalarFieldEnum | ReservationScalarFieldEnum[]
  }

  /**
   * Reservation create
   */
  export type ReservationCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Reservation
     */
    select?: ReservationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Reservation
     */
    omit?: ReservationOmit<ExtArgs> | null
    /**
     * The data needed to create a Reservation.
     */
    data: XOR<ReservationCreateInput, ReservationUncheckedCreateInput>
  }

  /**
   * Reservation createMany
   */
  export type ReservationCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Reservations.
     */
    data: ReservationCreateManyInput | ReservationCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Reservation createManyAndReturn
   */
  export type ReservationCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Reservation
     */
    select?: ReservationSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Reservation
     */
    omit?: ReservationOmit<ExtArgs> | null
    /**
     * The data used to create many Reservations.
     */
    data: ReservationCreateManyInput | ReservationCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Reservation update
   */
  export type ReservationUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Reservation
     */
    select?: ReservationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Reservation
     */
    omit?: ReservationOmit<ExtArgs> | null
    /**
     * The data needed to update a Reservation.
     */
    data: XOR<ReservationUpdateInput, ReservationUncheckedUpdateInput>
    /**
     * Choose, which Reservation to update.
     */
    where: ReservationWhereUniqueInput
  }

  /**
   * Reservation updateMany
   */
  export type ReservationUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Reservations.
     */
    data: XOR<ReservationUpdateManyMutationInput, ReservationUncheckedUpdateManyInput>
    /**
     * Filter which Reservations to update
     */
    where?: ReservationWhereInput
    /**
     * Limit how many Reservations to update.
     */
    limit?: number
  }

  /**
   * Reservation updateManyAndReturn
   */
  export type ReservationUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Reservation
     */
    select?: ReservationSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Reservation
     */
    omit?: ReservationOmit<ExtArgs> | null
    /**
     * The data used to update Reservations.
     */
    data: XOR<ReservationUpdateManyMutationInput, ReservationUncheckedUpdateManyInput>
    /**
     * Filter which Reservations to update
     */
    where?: ReservationWhereInput
    /**
     * Limit how many Reservations to update.
     */
    limit?: number
  }

  /**
   * Reservation upsert
   */
  export type ReservationUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Reservation
     */
    select?: ReservationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Reservation
     */
    omit?: ReservationOmit<ExtArgs> | null
    /**
     * The filter to search for the Reservation to update in case it exists.
     */
    where: ReservationWhereUniqueInput
    /**
     * In case the Reservation found by the `where` argument doesn't exist, create a new Reservation with this data.
     */
    create: XOR<ReservationCreateInput, ReservationUncheckedCreateInput>
    /**
     * In case the Reservation was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ReservationUpdateInput, ReservationUncheckedUpdateInput>
  }

  /**
   * Reservation delete
   */
  export type ReservationDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Reservation
     */
    select?: ReservationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Reservation
     */
    omit?: ReservationOmit<ExtArgs> | null
    /**
     * Filter which Reservation to delete.
     */
    where: ReservationWhereUniqueInput
  }

  /**
   * Reservation deleteMany
   */
  export type ReservationDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Reservations to delete
     */
    where?: ReservationWhereInput
    /**
     * Limit how many Reservations to delete.
     */
    limit?: number
  }

  /**
   * Reservation without action
   */
  export type ReservationDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Reservation
     */
    select?: ReservationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Reservation
     */
    omit?: ReservationOmit<ExtArgs> | null
  }


  /**
   * Model Admin
   */

  export type AggregateAdmin = {
    _count: AdminCountAggregateOutputType | null
    _avg: AdminAvgAggregateOutputType | null
    _sum: AdminSumAggregateOutputType | null
    _min: AdminMinAggregateOutputType | null
    _max: AdminMaxAggregateOutputType | null
  }

  export type AdminAvgAggregateOutputType = {
    id: number | null
  }

  export type AdminSumAggregateOutputType = {
    id: number | null
  }

  export type AdminMinAggregateOutputType = {
    id: number | null
    email: string | null
    passwordHash: string | null
    createdAt: Date | null
  }

  export type AdminMaxAggregateOutputType = {
    id: number | null
    email: string | null
    passwordHash: string | null
    createdAt: Date | null
  }

  export type AdminCountAggregateOutputType = {
    id: number
    email: number
    passwordHash: number
    createdAt: number
    _all: number
  }


  export type AdminAvgAggregateInputType = {
    id?: true
  }

  export type AdminSumAggregateInputType = {
    id?: true
  }

  export type AdminMinAggregateInputType = {
    id?: true
    email?: true
    passwordHash?: true
    createdAt?: true
  }

  export type AdminMaxAggregateInputType = {
    id?: true
    email?: true
    passwordHash?: true
    createdAt?: true
  }

  export type AdminCountAggregateInputType = {
    id?: true
    email?: true
    passwordHash?: true
    createdAt?: true
    _all?: true
  }

  export type AdminAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Admin to aggregate.
     */
    where?: AdminWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Admins to fetch.
     */
    orderBy?: AdminOrderByWithRelationInput | AdminOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AdminWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Admins from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Admins.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Admins
    **/
    _count?: true | AdminCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: AdminAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: AdminSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AdminMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AdminMaxAggregateInputType
  }

  export type GetAdminAggregateType<T extends AdminAggregateArgs> = {
        [P in keyof T & keyof AggregateAdmin]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAdmin[P]>
      : GetScalarType<T[P], AggregateAdmin[P]>
  }




  export type AdminGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AdminWhereInput
    orderBy?: AdminOrderByWithAggregationInput | AdminOrderByWithAggregationInput[]
    by: AdminScalarFieldEnum[] | AdminScalarFieldEnum
    having?: AdminScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AdminCountAggregateInputType | true
    _avg?: AdminAvgAggregateInputType
    _sum?: AdminSumAggregateInputType
    _min?: AdminMinAggregateInputType
    _max?: AdminMaxAggregateInputType
  }

  export type AdminGroupByOutputType = {
    id: number
    email: string
    passwordHash: string
    createdAt: Date
    _count: AdminCountAggregateOutputType | null
    _avg: AdminAvgAggregateOutputType | null
    _sum: AdminSumAggregateOutputType | null
    _min: AdminMinAggregateOutputType | null
    _max: AdminMaxAggregateOutputType | null
  }

  type GetAdminGroupByPayload<T extends AdminGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AdminGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AdminGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AdminGroupByOutputType[P]>
            : GetScalarType<T[P], AdminGroupByOutputType[P]>
        }
      >
    >


  export type AdminSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    passwordHash?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["admin"]>

  export type AdminSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    passwordHash?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["admin"]>

  export type AdminSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    passwordHash?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["admin"]>

  export type AdminSelectScalar = {
    id?: boolean
    email?: boolean
    passwordHash?: boolean
    createdAt?: boolean
  }

  export type AdminOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "email" | "passwordHash" | "createdAt", ExtArgs["result"]["admin"]>

  export type $AdminPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Admin"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: number
      email: string
      passwordHash: string
      createdAt: Date
    }, ExtArgs["result"]["admin"]>
    composites: {}
  }

  type AdminGetPayload<S extends boolean | null | undefined | AdminDefaultArgs> = $Result.GetResult<Prisma.$AdminPayload, S>

  type AdminCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<AdminFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: AdminCountAggregateInputType | true
    }

  export interface AdminDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Admin'], meta: { name: 'Admin' } }
    /**
     * Find zero or one Admin that matches the filter.
     * @param {AdminFindUniqueArgs} args - Arguments to find a Admin
     * @example
     * // Get one Admin
     * const admin = await prisma.admin.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AdminFindUniqueArgs>(args: SelectSubset<T, AdminFindUniqueArgs<ExtArgs>>): Prisma__AdminClient<$Result.GetResult<Prisma.$AdminPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Admin that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {AdminFindUniqueOrThrowArgs} args - Arguments to find a Admin
     * @example
     * // Get one Admin
     * const admin = await prisma.admin.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AdminFindUniqueOrThrowArgs>(args: SelectSubset<T, AdminFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AdminClient<$Result.GetResult<Prisma.$AdminPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Admin that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AdminFindFirstArgs} args - Arguments to find a Admin
     * @example
     * // Get one Admin
     * const admin = await prisma.admin.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AdminFindFirstArgs>(args?: SelectSubset<T, AdminFindFirstArgs<ExtArgs>>): Prisma__AdminClient<$Result.GetResult<Prisma.$AdminPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Admin that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AdminFindFirstOrThrowArgs} args - Arguments to find a Admin
     * @example
     * // Get one Admin
     * const admin = await prisma.admin.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AdminFindFirstOrThrowArgs>(args?: SelectSubset<T, AdminFindFirstOrThrowArgs<ExtArgs>>): Prisma__AdminClient<$Result.GetResult<Prisma.$AdminPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Admins that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AdminFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Admins
     * const admins = await prisma.admin.findMany()
     * 
     * // Get first 10 Admins
     * const admins = await prisma.admin.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const adminWithIdOnly = await prisma.admin.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AdminFindManyArgs>(args?: SelectSubset<T, AdminFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AdminPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Admin.
     * @param {AdminCreateArgs} args - Arguments to create a Admin.
     * @example
     * // Create one Admin
     * const Admin = await prisma.admin.create({
     *   data: {
     *     // ... data to create a Admin
     *   }
     * })
     * 
     */
    create<T extends AdminCreateArgs>(args: SelectSubset<T, AdminCreateArgs<ExtArgs>>): Prisma__AdminClient<$Result.GetResult<Prisma.$AdminPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Admins.
     * @param {AdminCreateManyArgs} args - Arguments to create many Admins.
     * @example
     * // Create many Admins
     * const admin = await prisma.admin.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AdminCreateManyArgs>(args?: SelectSubset<T, AdminCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Admins and returns the data saved in the database.
     * @param {AdminCreateManyAndReturnArgs} args - Arguments to create many Admins.
     * @example
     * // Create many Admins
     * const admin = await prisma.admin.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Admins and only return the `id`
     * const adminWithIdOnly = await prisma.admin.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AdminCreateManyAndReturnArgs>(args?: SelectSubset<T, AdminCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AdminPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Admin.
     * @param {AdminDeleteArgs} args - Arguments to delete one Admin.
     * @example
     * // Delete one Admin
     * const Admin = await prisma.admin.delete({
     *   where: {
     *     // ... filter to delete one Admin
     *   }
     * })
     * 
     */
    delete<T extends AdminDeleteArgs>(args: SelectSubset<T, AdminDeleteArgs<ExtArgs>>): Prisma__AdminClient<$Result.GetResult<Prisma.$AdminPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Admin.
     * @param {AdminUpdateArgs} args - Arguments to update one Admin.
     * @example
     * // Update one Admin
     * const admin = await prisma.admin.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AdminUpdateArgs>(args: SelectSubset<T, AdminUpdateArgs<ExtArgs>>): Prisma__AdminClient<$Result.GetResult<Prisma.$AdminPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Admins.
     * @param {AdminDeleteManyArgs} args - Arguments to filter Admins to delete.
     * @example
     * // Delete a few Admins
     * const { count } = await prisma.admin.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AdminDeleteManyArgs>(args?: SelectSubset<T, AdminDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Admins.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AdminUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Admins
     * const admin = await prisma.admin.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AdminUpdateManyArgs>(args: SelectSubset<T, AdminUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Admins and returns the data updated in the database.
     * @param {AdminUpdateManyAndReturnArgs} args - Arguments to update many Admins.
     * @example
     * // Update many Admins
     * const admin = await prisma.admin.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Admins and only return the `id`
     * const adminWithIdOnly = await prisma.admin.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends AdminUpdateManyAndReturnArgs>(args: SelectSubset<T, AdminUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AdminPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Admin.
     * @param {AdminUpsertArgs} args - Arguments to update or create a Admin.
     * @example
     * // Update or create a Admin
     * const admin = await prisma.admin.upsert({
     *   create: {
     *     // ... data to create a Admin
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Admin we want to update
     *   }
     * })
     */
    upsert<T extends AdminUpsertArgs>(args: SelectSubset<T, AdminUpsertArgs<ExtArgs>>): Prisma__AdminClient<$Result.GetResult<Prisma.$AdminPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Admins.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AdminCountArgs} args - Arguments to filter Admins to count.
     * @example
     * // Count the number of Admins
     * const count = await prisma.admin.count({
     *   where: {
     *     // ... the filter for the Admins we want to count
     *   }
     * })
    **/
    count<T extends AdminCountArgs>(
      args?: Subset<T, AdminCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AdminCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Admin.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AdminAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AdminAggregateArgs>(args: Subset<T, AdminAggregateArgs>): Prisma.PrismaPromise<GetAdminAggregateType<T>>

    /**
     * Group by Admin.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AdminGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends AdminGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AdminGroupByArgs['orderBy'] }
        : { orderBy?: AdminGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, AdminGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAdminGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Admin model
   */
  readonly fields: AdminFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Admin.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AdminClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Admin model
   */
  interface AdminFieldRefs {
    readonly id: FieldRef<"Admin", 'Int'>
    readonly email: FieldRef<"Admin", 'String'>
    readonly passwordHash: FieldRef<"Admin", 'String'>
    readonly createdAt: FieldRef<"Admin", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Admin findUnique
   */
  export type AdminFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Admin
     */
    select?: AdminSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Admin
     */
    omit?: AdminOmit<ExtArgs> | null
    /**
     * Filter, which Admin to fetch.
     */
    where: AdminWhereUniqueInput
  }

  /**
   * Admin findUniqueOrThrow
   */
  export type AdminFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Admin
     */
    select?: AdminSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Admin
     */
    omit?: AdminOmit<ExtArgs> | null
    /**
     * Filter, which Admin to fetch.
     */
    where: AdminWhereUniqueInput
  }

  /**
   * Admin findFirst
   */
  export type AdminFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Admin
     */
    select?: AdminSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Admin
     */
    omit?: AdminOmit<ExtArgs> | null
    /**
     * Filter, which Admin to fetch.
     */
    where?: AdminWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Admins to fetch.
     */
    orderBy?: AdminOrderByWithRelationInput | AdminOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Admins.
     */
    cursor?: AdminWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Admins from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Admins.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Admins.
     */
    distinct?: AdminScalarFieldEnum | AdminScalarFieldEnum[]
  }

  /**
   * Admin findFirstOrThrow
   */
  export type AdminFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Admin
     */
    select?: AdminSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Admin
     */
    omit?: AdminOmit<ExtArgs> | null
    /**
     * Filter, which Admin to fetch.
     */
    where?: AdminWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Admins to fetch.
     */
    orderBy?: AdminOrderByWithRelationInput | AdminOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Admins.
     */
    cursor?: AdminWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Admins from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Admins.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Admins.
     */
    distinct?: AdminScalarFieldEnum | AdminScalarFieldEnum[]
  }

  /**
   * Admin findMany
   */
  export type AdminFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Admin
     */
    select?: AdminSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Admin
     */
    omit?: AdminOmit<ExtArgs> | null
    /**
     * Filter, which Admins to fetch.
     */
    where?: AdminWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Admins to fetch.
     */
    orderBy?: AdminOrderByWithRelationInput | AdminOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Admins.
     */
    cursor?: AdminWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Admins from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Admins.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Admins.
     */
    distinct?: AdminScalarFieldEnum | AdminScalarFieldEnum[]
  }

  /**
   * Admin create
   */
  export type AdminCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Admin
     */
    select?: AdminSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Admin
     */
    omit?: AdminOmit<ExtArgs> | null
    /**
     * The data needed to create a Admin.
     */
    data: XOR<AdminCreateInput, AdminUncheckedCreateInput>
  }

  /**
   * Admin createMany
   */
  export type AdminCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Admins.
     */
    data: AdminCreateManyInput | AdminCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Admin createManyAndReturn
   */
  export type AdminCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Admin
     */
    select?: AdminSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Admin
     */
    omit?: AdminOmit<ExtArgs> | null
    /**
     * The data used to create many Admins.
     */
    data: AdminCreateManyInput | AdminCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Admin update
   */
  export type AdminUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Admin
     */
    select?: AdminSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Admin
     */
    omit?: AdminOmit<ExtArgs> | null
    /**
     * The data needed to update a Admin.
     */
    data: XOR<AdminUpdateInput, AdminUncheckedUpdateInput>
    /**
     * Choose, which Admin to update.
     */
    where: AdminWhereUniqueInput
  }

  /**
   * Admin updateMany
   */
  export type AdminUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Admins.
     */
    data: XOR<AdminUpdateManyMutationInput, AdminUncheckedUpdateManyInput>
    /**
     * Filter which Admins to update
     */
    where?: AdminWhereInput
    /**
     * Limit how many Admins to update.
     */
    limit?: number
  }

  /**
   * Admin updateManyAndReturn
   */
  export type AdminUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Admin
     */
    select?: AdminSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Admin
     */
    omit?: AdminOmit<ExtArgs> | null
    /**
     * The data used to update Admins.
     */
    data: XOR<AdminUpdateManyMutationInput, AdminUncheckedUpdateManyInput>
    /**
     * Filter which Admins to update
     */
    where?: AdminWhereInput
    /**
     * Limit how many Admins to update.
     */
    limit?: number
  }

  /**
   * Admin upsert
   */
  export type AdminUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Admin
     */
    select?: AdminSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Admin
     */
    omit?: AdminOmit<ExtArgs> | null
    /**
     * The filter to search for the Admin to update in case it exists.
     */
    where: AdminWhereUniqueInput
    /**
     * In case the Admin found by the `where` argument doesn't exist, create a new Admin with this data.
     */
    create: XOR<AdminCreateInput, AdminUncheckedCreateInput>
    /**
     * In case the Admin was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AdminUpdateInput, AdminUncheckedUpdateInput>
  }

  /**
   * Admin delete
   */
  export type AdminDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Admin
     */
    select?: AdminSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Admin
     */
    omit?: AdminOmit<ExtArgs> | null
    /**
     * Filter which Admin to delete.
     */
    where: AdminWhereUniqueInput
  }

  /**
   * Admin deleteMany
   */
  export type AdminDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Admins to delete
     */
    where?: AdminWhereInput
    /**
     * Limit how many Admins to delete.
     */
    limit?: number
  }

  /**
   * Admin without action
   */
  export type AdminDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Admin
     */
    select?: AdminSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Admin
     */
    omit?: AdminOmit<ExtArgs> | null
  }


  /**
   * Model RestaurantSettings
   */

  export type AggregateRestaurantSettings = {
    _count: RestaurantSettingsCountAggregateOutputType | null
    _avg: RestaurantSettingsAvgAggregateOutputType | null
    _sum: RestaurantSettingsSumAggregateOutputType | null
    _min: RestaurantSettingsMinAggregateOutputType | null
    _max: RestaurantSettingsMaxAggregateOutputType | null
  }

  export type RestaurantSettingsAvgAggregateOutputType = {
    id: number | null
    maxCovers: number | null
    mealDuration: number | null
    depositPerGuestCents: number | null
  }

  export type RestaurantSettingsSumAggregateOutputType = {
    id: number | null
    maxCovers: number | null
    mealDuration: number | null
    depositPerGuestCents: number | null
  }

  export type RestaurantSettingsMinAggregateOutputType = {
    id: number | null
    maxCovers: number | null
    mealDuration: number | null
    openingDays: string | null
    openingSlots: string | null
    depositPerGuestCents: number | null
  }

  export type RestaurantSettingsMaxAggregateOutputType = {
    id: number | null
    maxCovers: number | null
    mealDuration: number | null
    openingDays: string | null
    openingSlots: string | null
    depositPerGuestCents: number | null
  }

  export type RestaurantSettingsCountAggregateOutputType = {
    id: number
    maxCovers: number
    mealDuration: number
    openingDays: number
    openingSlots: number
    depositPerGuestCents: number
    _all: number
  }


  export type RestaurantSettingsAvgAggregateInputType = {
    id?: true
    maxCovers?: true
    mealDuration?: true
    depositPerGuestCents?: true
  }

  export type RestaurantSettingsSumAggregateInputType = {
    id?: true
    maxCovers?: true
    mealDuration?: true
    depositPerGuestCents?: true
  }

  export type RestaurantSettingsMinAggregateInputType = {
    id?: true
    maxCovers?: true
    mealDuration?: true
    openingDays?: true
    openingSlots?: true
    depositPerGuestCents?: true
  }

  export type RestaurantSettingsMaxAggregateInputType = {
    id?: true
    maxCovers?: true
    mealDuration?: true
    openingDays?: true
    openingSlots?: true
    depositPerGuestCents?: true
  }

  export type RestaurantSettingsCountAggregateInputType = {
    id?: true
    maxCovers?: true
    mealDuration?: true
    openingDays?: true
    openingSlots?: true
    depositPerGuestCents?: true
    _all?: true
  }

  export type RestaurantSettingsAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which RestaurantSettings to aggregate.
     */
    where?: RestaurantSettingsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RestaurantSettings to fetch.
     */
    orderBy?: RestaurantSettingsOrderByWithRelationInput | RestaurantSettingsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: RestaurantSettingsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RestaurantSettings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RestaurantSettings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned RestaurantSettings
    **/
    _count?: true | RestaurantSettingsCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: RestaurantSettingsAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: RestaurantSettingsSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: RestaurantSettingsMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: RestaurantSettingsMaxAggregateInputType
  }

  export type GetRestaurantSettingsAggregateType<T extends RestaurantSettingsAggregateArgs> = {
        [P in keyof T & keyof AggregateRestaurantSettings]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateRestaurantSettings[P]>
      : GetScalarType<T[P], AggregateRestaurantSettings[P]>
  }




  export type RestaurantSettingsGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RestaurantSettingsWhereInput
    orderBy?: RestaurantSettingsOrderByWithAggregationInput | RestaurantSettingsOrderByWithAggregationInput[]
    by: RestaurantSettingsScalarFieldEnum[] | RestaurantSettingsScalarFieldEnum
    having?: RestaurantSettingsScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: RestaurantSettingsCountAggregateInputType | true
    _avg?: RestaurantSettingsAvgAggregateInputType
    _sum?: RestaurantSettingsSumAggregateInputType
    _min?: RestaurantSettingsMinAggregateInputType
    _max?: RestaurantSettingsMaxAggregateInputType
  }

  export type RestaurantSettingsGroupByOutputType = {
    id: number
    maxCovers: number
    mealDuration: number
    openingDays: string
    openingSlots: string
    depositPerGuestCents: number
    _count: RestaurantSettingsCountAggregateOutputType | null
    _avg: RestaurantSettingsAvgAggregateOutputType | null
    _sum: RestaurantSettingsSumAggregateOutputType | null
    _min: RestaurantSettingsMinAggregateOutputType | null
    _max: RestaurantSettingsMaxAggregateOutputType | null
  }

  type GetRestaurantSettingsGroupByPayload<T extends RestaurantSettingsGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<RestaurantSettingsGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof RestaurantSettingsGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], RestaurantSettingsGroupByOutputType[P]>
            : GetScalarType<T[P], RestaurantSettingsGroupByOutputType[P]>
        }
      >
    >


  export type RestaurantSettingsSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    maxCovers?: boolean
    mealDuration?: boolean
    openingDays?: boolean
    openingSlots?: boolean
    depositPerGuestCents?: boolean
  }, ExtArgs["result"]["restaurantSettings"]>

  export type RestaurantSettingsSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    maxCovers?: boolean
    mealDuration?: boolean
    openingDays?: boolean
    openingSlots?: boolean
    depositPerGuestCents?: boolean
  }, ExtArgs["result"]["restaurantSettings"]>

  export type RestaurantSettingsSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    maxCovers?: boolean
    mealDuration?: boolean
    openingDays?: boolean
    openingSlots?: boolean
    depositPerGuestCents?: boolean
  }, ExtArgs["result"]["restaurantSettings"]>

  export type RestaurantSettingsSelectScalar = {
    id?: boolean
    maxCovers?: boolean
    mealDuration?: boolean
    openingDays?: boolean
    openingSlots?: boolean
    depositPerGuestCents?: boolean
  }

  export type RestaurantSettingsOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "maxCovers" | "mealDuration" | "openingDays" | "openingSlots" | "depositPerGuestCents", ExtArgs["result"]["restaurantSettings"]>

  export type $RestaurantSettingsPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "RestaurantSettings"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: number
      maxCovers: number
      mealDuration: number
      openingDays: string
      openingSlots: string
      depositPerGuestCents: number
    }, ExtArgs["result"]["restaurantSettings"]>
    composites: {}
  }

  type RestaurantSettingsGetPayload<S extends boolean | null | undefined | RestaurantSettingsDefaultArgs> = $Result.GetResult<Prisma.$RestaurantSettingsPayload, S>

  type RestaurantSettingsCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<RestaurantSettingsFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: RestaurantSettingsCountAggregateInputType | true
    }

  export interface RestaurantSettingsDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['RestaurantSettings'], meta: { name: 'RestaurantSettings' } }
    /**
     * Find zero or one RestaurantSettings that matches the filter.
     * @param {RestaurantSettingsFindUniqueArgs} args - Arguments to find a RestaurantSettings
     * @example
     * // Get one RestaurantSettings
     * const restaurantSettings = await prisma.restaurantSettings.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends RestaurantSettingsFindUniqueArgs>(args: SelectSubset<T, RestaurantSettingsFindUniqueArgs<ExtArgs>>): Prisma__RestaurantSettingsClient<$Result.GetResult<Prisma.$RestaurantSettingsPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one RestaurantSettings that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {RestaurantSettingsFindUniqueOrThrowArgs} args - Arguments to find a RestaurantSettings
     * @example
     * // Get one RestaurantSettings
     * const restaurantSettings = await prisma.restaurantSettings.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends RestaurantSettingsFindUniqueOrThrowArgs>(args: SelectSubset<T, RestaurantSettingsFindUniqueOrThrowArgs<ExtArgs>>): Prisma__RestaurantSettingsClient<$Result.GetResult<Prisma.$RestaurantSettingsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first RestaurantSettings that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RestaurantSettingsFindFirstArgs} args - Arguments to find a RestaurantSettings
     * @example
     * // Get one RestaurantSettings
     * const restaurantSettings = await prisma.restaurantSettings.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends RestaurantSettingsFindFirstArgs>(args?: SelectSubset<T, RestaurantSettingsFindFirstArgs<ExtArgs>>): Prisma__RestaurantSettingsClient<$Result.GetResult<Prisma.$RestaurantSettingsPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first RestaurantSettings that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RestaurantSettingsFindFirstOrThrowArgs} args - Arguments to find a RestaurantSettings
     * @example
     * // Get one RestaurantSettings
     * const restaurantSettings = await prisma.restaurantSettings.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends RestaurantSettingsFindFirstOrThrowArgs>(args?: SelectSubset<T, RestaurantSettingsFindFirstOrThrowArgs<ExtArgs>>): Prisma__RestaurantSettingsClient<$Result.GetResult<Prisma.$RestaurantSettingsPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more RestaurantSettings that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RestaurantSettingsFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all RestaurantSettings
     * const restaurantSettings = await prisma.restaurantSettings.findMany()
     * 
     * // Get first 10 RestaurantSettings
     * const restaurantSettings = await prisma.restaurantSettings.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const restaurantSettingsWithIdOnly = await prisma.restaurantSettings.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends RestaurantSettingsFindManyArgs>(args?: SelectSubset<T, RestaurantSettingsFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RestaurantSettingsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a RestaurantSettings.
     * @param {RestaurantSettingsCreateArgs} args - Arguments to create a RestaurantSettings.
     * @example
     * // Create one RestaurantSettings
     * const RestaurantSettings = await prisma.restaurantSettings.create({
     *   data: {
     *     // ... data to create a RestaurantSettings
     *   }
     * })
     * 
     */
    create<T extends RestaurantSettingsCreateArgs>(args: SelectSubset<T, RestaurantSettingsCreateArgs<ExtArgs>>): Prisma__RestaurantSettingsClient<$Result.GetResult<Prisma.$RestaurantSettingsPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many RestaurantSettings.
     * @param {RestaurantSettingsCreateManyArgs} args - Arguments to create many RestaurantSettings.
     * @example
     * // Create many RestaurantSettings
     * const restaurantSettings = await prisma.restaurantSettings.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends RestaurantSettingsCreateManyArgs>(args?: SelectSubset<T, RestaurantSettingsCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many RestaurantSettings and returns the data saved in the database.
     * @param {RestaurantSettingsCreateManyAndReturnArgs} args - Arguments to create many RestaurantSettings.
     * @example
     * // Create many RestaurantSettings
     * const restaurantSettings = await prisma.restaurantSettings.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many RestaurantSettings and only return the `id`
     * const restaurantSettingsWithIdOnly = await prisma.restaurantSettings.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends RestaurantSettingsCreateManyAndReturnArgs>(args?: SelectSubset<T, RestaurantSettingsCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RestaurantSettingsPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a RestaurantSettings.
     * @param {RestaurantSettingsDeleteArgs} args - Arguments to delete one RestaurantSettings.
     * @example
     * // Delete one RestaurantSettings
     * const RestaurantSettings = await prisma.restaurantSettings.delete({
     *   where: {
     *     // ... filter to delete one RestaurantSettings
     *   }
     * })
     * 
     */
    delete<T extends RestaurantSettingsDeleteArgs>(args: SelectSubset<T, RestaurantSettingsDeleteArgs<ExtArgs>>): Prisma__RestaurantSettingsClient<$Result.GetResult<Prisma.$RestaurantSettingsPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one RestaurantSettings.
     * @param {RestaurantSettingsUpdateArgs} args - Arguments to update one RestaurantSettings.
     * @example
     * // Update one RestaurantSettings
     * const restaurantSettings = await prisma.restaurantSettings.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends RestaurantSettingsUpdateArgs>(args: SelectSubset<T, RestaurantSettingsUpdateArgs<ExtArgs>>): Prisma__RestaurantSettingsClient<$Result.GetResult<Prisma.$RestaurantSettingsPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more RestaurantSettings.
     * @param {RestaurantSettingsDeleteManyArgs} args - Arguments to filter RestaurantSettings to delete.
     * @example
     * // Delete a few RestaurantSettings
     * const { count } = await prisma.restaurantSettings.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends RestaurantSettingsDeleteManyArgs>(args?: SelectSubset<T, RestaurantSettingsDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more RestaurantSettings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RestaurantSettingsUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many RestaurantSettings
     * const restaurantSettings = await prisma.restaurantSettings.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends RestaurantSettingsUpdateManyArgs>(args: SelectSubset<T, RestaurantSettingsUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more RestaurantSettings and returns the data updated in the database.
     * @param {RestaurantSettingsUpdateManyAndReturnArgs} args - Arguments to update many RestaurantSettings.
     * @example
     * // Update many RestaurantSettings
     * const restaurantSettings = await prisma.restaurantSettings.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more RestaurantSettings and only return the `id`
     * const restaurantSettingsWithIdOnly = await prisma.restaurantSettings.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends RestaurantSettingsUpdateManyAndReturnArgs>(args: SelectSubset<T, RestaurantSettingsUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RestaurantSettingsPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one RestaurantSettings.
     * @param {RestaurantSettingsUpsertArgs} args - Arguments to update or create a RestaurantSettings.
     * @example
     * // Update or create a RestaurantSettings
     * const restaurantSettings = await prisma.restaurantSettings.upsert({
     *   create: {
     *     // ... data to create a RestaurantSettings
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the RestaurantSettings we want to update
     *   }
     * })
     */
    upsert<T extends RestaurantSettingsUpsertArgs>(args: SelectSubset<T, RestaurantSettingsUpsertArgs<ExtArgs>>): Prisma__RestaurantSettingsClient<$Result.GetResult<Prisma.$RestaurantSettingsPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of RestaurantSettings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RestaurantSettingsCountArgs} args - Arguments to filter RestaurantSettings to count.
     * @example
     * // Count the number of RestaurantSettings
     * const count = await prisma.restaurantSettings.count({
     *   where: {
     *     // ... the filter for the RestaurantSettings we want to count
     *   }
     * })
    **/
    count<T extends RestaurantSettingsCountArgs>(
      args?: Subset<T, RestaurantSettingsCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], RestaurantSettingsCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a RestaurantSettings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RestaurantSettingsAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends RestaurantSettingsAggregateArgs>(args: Subset<T, RestaurantSettingsAggregateArgs>): Prisma.PrismaPromise<GetRestaurantSettingsAggregateType<T>>

    /**
     * Group by RestaurantSettings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RestaurantSettingsGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends RestaurantSettingsGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: RestaurantSettingsGroupByArgs['orderBy'] }
        : { orderBy?: RestaurantSettingsGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, RestaurantSettingsGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetRestaurantSettingsGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the RestaurantSettings model
   */
  readonly fields: RestaurantSettingsFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for RestaurantSettings.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__RestaurantSettingsClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the RestaurantSettings model
   */
  interface RestaurantSettingsFieldRefs {
    readonly id: FieldRef<"RestaurantSettings", 'Int'>
    readonly maxCovers: FieldRef<"RestaurantSettings", 'Int'>
    readonly mealDuration: FieldRef<"RestaurantSettings", 'Int'>
    readonly openingDays: FieldRef<"RestaurantSettings", 'String'>
    readonly openingSlots: FieldRef<"RestaurantSettings", 'String'>
    readonly depositPerGuestCents: FieldRef<"RestaurantSettings", 'Int'>
  }
    

  // Custom InputTypes
  /**
   * RestaurantSettings findUnique
   */
  export type RestaurantSettingsFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RestaurantSettings
     */
    select?: RestaurantSettingsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RestaurantSettings
     */
    omit?: RestaurantSettingsOmit<ExtArgs> | null
    /**
     * Filter, which RestaurantSettings to fetch.
     */
    where: RestaurantSettingsWhereUniqueInput
  }

  /**
   * RestaurantSettings findUniqueOrThrow
   */
  export type RestaurantSettingsFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RestaurantSettings
     */
    select?: RestaurantSettingsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RestaurantSettings
     */
    omit?: RestaurantSettingsOmit<ExtArgs> | null
    /**
     * Filter, which RestaurantSettings to fetch.
     */
    where: RestaurantSettingsWhereUniqueInput
  }

  /**
   * RestaurantSettings findFirst
   */
  export type RestaurantSettingsFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RestaurantSettings
     */
    select?: RestaurantSettingsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RestaurantSettings
     */
    omit?: RestaurantSettingsOmit<ExtArgs> | null
    /**
     * Filter, which RestaurantSettings to fetch.
     */
    where?: RestaurantSettingsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RestaurantSettings to fetch.
     */
    orderBy?: RestaurantSettingsOrderByWithRelationInput | RestaurantSettingsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for RestaurantSettings.
     */
    cursor?: RestaurantSettingsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RestaurantSettings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RestaurantSettings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of RestaurantSettings.
     */
    distinct?: RestaurantSettingsScalarFieldEnum | RestaurantSettingsScalarFieldEnum[]
  }

  /**
   * RestaurantSettings findFirstOrThrow
   */
  export type RestaurantSettingsFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RestaurantSettings
     */
    select?: RestaurantSettingsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RestaurantSettings
     */
    omit?: RestaurantSettingsOmit<ExtArgs> | null
    /**
     * Filter, which RestaurantSettings to fetch.
     */
    where?: RestaurantSettingsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RestaurantSettings to fetch.
     */
    orderBy?: RestaurantSettingsOrderByWithRelationInput | RestaurantSettingsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for RestaurantSettings.
     */
    cursor?: RestaurantSettingsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RestaurantSettings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RestaurantSettings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of RestaurantSettings.
     */
    distinct?: RestaurantSettingsScalarFieldEnum | RestaurantSettingsScalarFieldEnum[]
  }

  /**
   * RestaurantSettings findMany
   */
  export type RestaurantSettingsFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RestaurantSettings
     */
    select?: RestaurantSettingsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RestaurantSettings
     */
    omit?: RestaurantSettingsOmit<ExtArgs> | null
    /**
     * Filter, which RestaurantSettings to fetch.
     */
    where?: RestaurantSettingsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RestaurantSettings to fetch.
     */
    orderBy?: RestaurantSettingsOrderByWithRelationInput | RestaurantSettingsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing RestaurantSettings.
     */
    cursor?: RestaurantSettingsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RestaurantSettings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RestaurantSettings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of RestaurantSettings.
     */
    distinct?: RestaurantSettingsScalarFieldEnum | RestaurantSettingsScalarFieldEnum[]
  }

  /**
   * RestaurantSettings create
   */
  export type RestaurantSettingsCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RestaurantSettings
     */
    select?: RestaurantSettingsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RestaurantSettings
     */
    omit?: RestaurantSettingsOmit<ExtArgs> | null
    /**
     * The data needed to create a RestaurantSettings.
     */
    data?: XOR<RestaurantSettingsCreateInput, RestaurantSettingsUncheckedCreateInput>
  }

  /**
   * RestaurantSettings createMany
   */
  export type RestaurantSettingsCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many RestaurantSettings.
     */
    data: RestaurantSettingsCreateManyInput | RestaurantSettingsCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * RestaurantSettings createManyAndReturn
   */
  export type RestaurantSettingsCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RestaurantSettings
     */
    select?: RestaurantSettingsSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the RestaurantSettings
     */
    omit?: RestaurantSettingsOmit<ExtArgs> | null
    /**
     * The data used to create many RestaurantSettings.
     */
    data: RestaurantSettingsCreateManyInput | RestaurantSettingsCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * RestaurantSettings update
   */
  export type RestaurantSettingsUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RestaurantSettings
     */
    select?: RestaurantSettingsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RestaurantSettings
     */
    omit?: RestaurantSettingsOmit<ExtArgs> | null
    /**
     * The data needed to update a RestaurantSettings.
     */
    data: XOR<RestaurantSettingsUpdateInput, RestaurantSettingsUncheckedUpdateInput>
    /**
     * Choose, which RestaurantSettings to update.
     */
    where: RestaurantSettingsWhereUniqueInput
  }

  /**
   * RestaurantSettings updateMany
   */
  export type RestaurantSettingsUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update RestaurantSettings.
     */
    data: XOR<RestaurantSettingsUpdateManyMutationInput, RestaurantSettingsUncheckedUpdateManyInput>
    /**
     * Filter which RestaurantSettings to update
     */
    where?: RestaurantSettingsWhereInput
    /**
     * Limit how many RestaurantSettings to update.
     */
    limit?: number
  }

  /**
   * RestaurantSettings updateManyAndReturn
   */
  export type RestaurantSettingsUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RestaurantSettings
     */
    select?: RestaurantSettingsSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the RestaurantSettings
     */
    omit?: RestaurantSettingsOmit<ExtArgs> | null
    /**
     * The data used to update RestaurantSettings.
     */
    data: XOR<RestaurantSettingsUpdateManyMutationInput, RestaurantSettingsUncheckedUpdateManyInput>
    /**
     * Filter which RestaurantSettings to update
     */
    where?: RestaurantSettingsWhereInput
    /**
     * Limit how many RestaurantSettings to update.
     */
    limit?: number
  }

  /**
   * RestaurantSettings upsert
   */
  export type RestaurantSettingsUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RestaurantSettings
     */
    select?: RestaurantSettingsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RestaurantSettings
     */
    omit?: RestaurantSettingsOmit<ExtArgs> | null
    /**
     * The filter to search for the RestaurantSettings to update in case it exists.
     */
    where: RestaurantSettingsWhereUniqueInput
    /**
     * In case the RestaurantSettings found by the `where` argument doesn't exist, create a new RestaurantSettings with this data.
     */
    create: XOR<RestaurantSettingsCreateInput, RestaurantSettingsUncheckedCreateInput>
    /**
     * In case the RestaurantSettings was found with the provided `where` argument, update it with this data.
     */
    update: XOR<RestaurantSettingsUpdateInput, RestaurantSettingsUncheckedUpdateInput>
  }

  /**
   * RestaurantSettings delete
   */
  export type RestaurantSettingsDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RestaurantSettings
     */
    select?: RestaurantSettingsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RestaurantSettings
     */
    omit?: RestaurantSettingsOmit<ExtArgs> | null
    /**
     * Filter which RestaurantSettings to delete.
     */
    where: RestaurantSettingsWhereUniqueInput
  }

  /**
   * RestaurantSettings deleteMany
   */
  export type RestaurantSettingsDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which RestaurantSettings to delete
     */
    where?: RestaurantSettingsWhereInput
    /**
     * Limit how many RestaurantSettings to delete.
     */
    limit?: number
  }

  /**
   * RestaurantSettings without action
   */
  export type RestaurantSettingsDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RestaurantSettings
     */
    select?: RestaurantSettingsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RestaurantSettings
     */
    omit?: RestaurantSettingsOmit<ExtArgs> | null
  }


  /**
   * Model DayOverride
   */

  export type AggregateDayOverride = {
    _count: DayOverrideCountAggregateOutputType | null
    _avg: DayOverrideAvgAggregateOutputType | null
    _sum: DayOverrideSumAggregateOutputType | null
    _min: DayOverrideMinAggregateOutputType | null
    _max: DayOverrideMaxAggregateOutputType | null
  }

  export type DayOverrideAvgAggregateOutputType = {
    id: number | null
    maxCovers: number | null
  }

  export type DayOverrideSumAggregateOutputType = {
    id: number | null
    maxCovers: number | null
  }

  export type DayOverrideMinAggregateOutputType = {
    id: number | null
    date: Date | null
    closed: boolean | null
    maxCovers: number | null
    openingSlots: string | null
  }

  export type DayOverrideMaxAggregateOutputType = {
    id: number | null
    date: Date | null
    closed: boolean | null
    maxCovers: number | null
    openingSlots: string | null
  }

  export type DayOverrideCountAggregateOutputType = {
    id: number
    date: number
    closed: number
    maxCovers: number
    openingSlots: number
    _all: number
  }


  export type DayOverrideAvgAggregateInputType = {
    id?: true
    maxCovers?: true
  }

  export type DayOverrideSumAggregateInputType = {
    id?: true
    maxCovers?: true
  }

  export type DayOverrideMinAggregateInputType = {
    id?: true
    date?: true
    closed?: true
    maxCovers?: true
    openingSlots?: true
  }

  export type DayOverrideMaxAggregateInputType = {
    id?: true
    date?: true
    closed?: true
    maxCovers?: true
    openingSlots?: true
  }

  export type DayOverrideCountAggregateInputType = {
    id?: true
    date?: true
    closed?: true
    maxCovers?: true
    openingSlots?: true
    _all?: true
  }

  export type DayOverrideAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which DayOverride to aggregate.
     */
    where?: DayOverrideWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DayOverrides to fetch.
     */
    orderBy?: DayOverrideOrderByWithRelationInput | DayOverrideOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: DayOverrideWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DayOverrides from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DayOverrides.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned DayOverrides
    **/
    _count?: true | DayOverrideCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: DayOverrideAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: DayOverrideSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: DayOverrideMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: DayOverrideMaxAggregateInputType
  }

  export type GetDayOverrideAggregateType<T extends DayOverrideAggregateArgs> = {
        [P in keyof T & keyof AggregateDayOverride]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateDayOverride[P]>
      : GetScalarType<T[P], AggregateDayOverride[P]>
  }




  export type DayOverrideGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DayOverrideWhereInput
    orderBy?: DayOverrideOrderByWithAggregationInput | DayOverrideOrderByWithAggregationInput[]
    by: DayOverrideScalarFieldEnum[] | DayOverrideScalarFieldEnum
    having?: DayOverrideScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: DayOverrideCountAggregateInputType | true
    _avg?: DayOverrideAvgAggregateInputType
    _sum?: DayOverrideSumAggregateInputType
    _min?: DayOverrideMinAggregateInputType
    _max?: DayOverrideMaxAggregateInputType
  }

  export type DayOverrideGroupByOutputType = {
    id: number
    date: Date
    closed: boolean
    maxCovers: number | null
    openingSlots: string | null
    _count: DayOverrideCountAggregateOutputType | null
    _avg: DayOverrideAvgAggregateOutputType | null
    _sum: DayOverrideSumAggregateOutputType | null
    _min: DayOverrideMinAggregateOutputType | null
    _max: DayOverrideMaxAggregateOutputType | null
  }

  type GetDayOverrideGroupByPayload<T extends DayOverrideGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<DayOverrideGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof DayOverrideGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], DayOverrideGroupByOutputType[P]>
            : GetScalarType<T[P], DayOverrideGroupByOutputType[P]>
        }
      >
    >


  export type DayOverrideSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    date?: boolean
    closed?: boolean
    maxCovers?: boolean
    openingSlots?: boolean
  }, ExtArgs["result"]["dayOverride"]>

  export type DayOverrideSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    date?: boolean
    closed?: boolean
    maxCovers?: boolean
    openingSlots?: boolean
  }, ExtArgs["result"]["dayOverride"]>

  export type DayOverrideSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    date?: boolean
    closed?: boolean
    maxCovers?: boolean
    openingSlots?: boolean
  }, ExtArgs["result"]["dayOverride"]>

  export type DayOverrideSelectScalar = {
    id?: boolean
    date?: boolean
    closed?: boolean
    maxCovers?: boolean
    openingSlots?: boolean
  }

  export type DayOverrideOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "date" | "closed" | "maxCovers" | "openingSlots", ExtArgs["result"]["dayOverride"]>

  export type $DayOverridePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "DayOverride"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: number
      date: Date
      closed: boolean
      maxCovers: number | null
      openingSlots: string | null
    }, ExtArgs["result"]["dayOverride"]>
    composites: {}
  }

  type DayOverrideGetPayload<S extends boolean | null | undefined | DayOverrideDefaultArgs> = $Result.GetResult<Prisma.$DayOverridePayload, S>

  type DayOverrideCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<DayOverrideFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: DayOverrideCountAggregateInputType | true
    }

  export interface DayOverrideDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['DayOverride'], meta: { name: 'DayOverride' } }
    /**
     * Find zero or one DayOverride that matches the filter.
     * @param {DayOverrideFindUniqueArgs} args - Arguments to find a DayOverride
     * @example
     * // Get one DayOverride
     * const dayOverride = await prisma.dayOverride.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends DayOverrideFindUniqueArgs>(args: SelectSubset<T, DayOverrideFindUniqueArgs<ExtArgs>>): Prisma__DayOverrideClient<$Result.GetResult<Prisma.$DayOverridePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one DayOverride that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {DayOverrideFindUniqueOrThrowArgs} args - Arguments to find a DayOverride
     * @example
     * // Get one DayOverride
     * const dayOverride = await prisma.dayOverride.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends DayOverrideFindUniqueOrThrowArgs>(args: SelectSubset<T, DayOverrideFindUniqueOrThrowArgs<ExtArgs>>): Prisma__DayOverrideClient<$Result.GetResult<Prisma.$DayOverridePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first DayOverride that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DayOverrideFindFirstArgs} args - Arguments to find a DayOverride
     * @example
     * // Get one DayOverride
     * const dayOverride = await prisma.dayOverride.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends DayOverrideFindFirstArgs>(args?: SelectSubset<T, DayOverrideFindFirstArgs<ExtArgs>>): Prisma__DayOverrideClient<$Result.GetResult<Prisma.$DayOverridePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first DayOverride that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DayOverrideFindFirstOrThrowArgs} args - Arguments to find a DayOverride
     * @example
     * // Get one DayOverride
     * const dayOverride = await prisma.dayOverride.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends DayOverrideFindFirstOrThrowArgs>(args?: SelectSubset<T, DayOverrideFindFirstOrThrowArgs<ExtArgs>>): Prisma__DayOverrideClient<$Result.GetResult<Prisma.$DayOverridePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more DayOverrides that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DayOverrideFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all DayOverrides
     * const dayOverrides = await prisma.dayOverride.findMany()
     * 
     * // Get first 10 DayOverrides
     * const dayOverrides = await prisma.dayOverride.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const dayOverrideWithIdOnly = await prisma.dayOverride.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends DayOverrideFindManyArgs>(args?: SelectSubset<T, DayOverrideFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DayOverridePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a DayOverride.
     * @param {DayOverrideCreateArgs} args - Arguments to create a DayOverride.
     * @example
     * // Create one DayOverride
     * const DayOverride = await prisma.dayOverride.create({
     *   data: {
     *     // ... data to create a DayOverride
     *   }
     * })
     * 
     */
    create<T extends DayOverrideCreateArgs>(args: SelectSubset<T, DayOverrideCreateArgs<ExtArgs>>): Prisma__DayOverrideClient<$Result.GetResult<Prisma.$DayOverridePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many DayOverrides.
     * @param {DayOverrideCreateManyArgs} args - Arguments to create many DayOverrides.
     * @example
     * // Create many DayOverrides
     * const dayOverride = await prisma.dayOverride.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends DayOverrideCreateManyArgs>(args?: SelectSubset<T, DayOverrideCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many DayOverrides and returns the data saved in the database.
     * @param {DayOverrideCreateManyAndReturnArgs} args - Arguments to create many DayOverrides.
     * @example
     * // Create many DayOverrides
     * const dayOverride = await prisma.dayOverride.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many DayOverrides and only return the `id`
     * const dayOverrideWithIdOnly = await prisma.dayOverride.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends DayOverrideCreateManyAndReturnArgs>(args?: SelectSubset<T, DayOverrideCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DayOverridePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a DayOverride.
     * @param {DayOverrideDeleteArgs} args - Arguments to delete one DayOverride.
     * @example
     * // Delete one DayOverride
     * const DayOverride = await prisma.dayOverride.delete({
     *   where: {
     *     // ... filter to delete one DayOverride
     *   }
     * })
     * 
     */
    delete<T extends DayOverrideDeleteArgs>(args: SelectSubset<T, DayOverrideDeleteArgs<ExtArgs>>): Prisma__DayOverrideClient<$Result.GetResult<Prisma.$DayOverridePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one DayOverride.
     * @param {DayOverrideUpdateArgs} args - Arguments to update one DayOverride.
     * @example
     * // Update one DayOverride
     * const dayOverride = await prisma.dayOverride.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends DayOverrideUpdateArgs>(args: SelectSubset<T, DayOverrideUpdateArgs<ExtArgs>>): Prisma__DayOverrideClient<$Result.GetResult<Prisma.$DayOverridePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more DayOverrides.
     * @param {DayOverrideDeleteManyArgs} args - Arguments to filter DayOverrides to delete.
     * @example
     * // Delete a few DayOverrides
     * const { count } = await prisma.dayOverride.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends DayOverrideDeleteManyArgs>(args?: SelectSubset<T, DayOverrideDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more DayOverrides.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DayOverrideUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many DayOverrides
     * const dayOverride = await prisma.dayOverride.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends DayOverrideUpdateManyArgs>(args: SelectSubset<T, DayOverrideUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more DayOverrides and returns the data updated in the database.
     * @param {DayOverrideUpdateManyAndReturnArgs} args - Arguments to update many DayOverrides.
     * @example
     * // Update many DayOverrides
     * const dayOverride = await prisma.dayOverride.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more DayOverrides and only return the `id`
     * const dayOverrideWithIdOnly = await prisma.dayOverride.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends DayOverrideUpdateManyAndReturnArgs>(args: SelectSubset<T, DayOverrideUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DayOverridePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one DayOverride.
     * @param {DayOverrideUpsertArgs} args - Arguments to update or create a DayOverride.
     * @example
     * // Update or create a DayOverride
     * const dayOverride = await prisma.dayOverride.upsert({
     *   create: {
     *     // ... data to create a DayOverride
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the DayOverride we want to update
     *   }
     * })
     */
    upsert<T extends DayOverrideUpsertArgs>(args: SelectSubset<T, DayOverrideUpsertArgs<ExtArgs>>): Prisma__DayOverrideClient<$Result.GetResult<Prisma.$DayOverridePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of DayOverrides.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DayOverrideCountArgs} args - Arguments to filter DayOverrides to count.
     * @example
     * // Count the number of DayOverrides
     * const count = await prisma.dayOverride.count({
     *   where: {
     *     // ... the filter for the DayOverrides we want to count
     *   }
     * })
    **/
    count<T extends DayOverrideCountArgs>(
      args?: Subset<T, DayOverrideCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], DayOverrideCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a DayOverride.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DayOverrideAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends DayOverrideAggregateArgs>(args: Subset<T, DayOverrideAggregateArgs>): Prisma.PrismaPromise<GetDayOverrideAggregateType<T>>

    /**
     * Group by DayOverride.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DayOverrideGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends DayOverrideGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: DayOverrideGroupByArgs['orderBy'] }
        : { orderBy?: DayOverrideGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, DayOverrideGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetDayOverrideGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the DayOverride model
   */
  readonly fields: DayOverrideFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for DayOverride.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__DayOverrideClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the DayOverride model
   */
  interface DayOverrideFieldRefs {
    readonly id: FieldRef<"DayOverride", 'Int'>
    readonly date: FieldRef<"DayOverride", 'DateTime'>
    readonly closed: FieldRef<"DayOverride", 'Boolean'>
    readonly maxCovers: FieldRef<"DayOverride", 'Int'>
    readonly openingSlots: FieldRef<"DayOverride", 'String'>
  }
    

  // Custom InputTypes
  /**
   * DayOverride findUnique
   */
  export type DayOverrideFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DayOverride
     */
    select?: DayOverrideSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DayOverride
     */
    omit?: DayOverrideOmit<ExtArgs> | null
    /**
     * Filter, which DayOverride to fetch.
     */
    where: DayOverrideWhereUniqueInput
  }

  /**
   * DayOverride findUniqueOrThrow
   */
  export type DayOverrideFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DayOverride
     */
    select?: DayOverrideSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DayOverride
     */
    omit?: DayOverrideOmit<ExtArgs> | null
    /**
     * Filter, which DayOverride to fetch.
     */
    where: DayOverrideWhereUniqueInput
  }

  /**
   * DayOverride findFirst
   */
  export type DayOverrideFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DayOverride
     */
    select?: DayOverrideSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DayOverride
     */
    omit?: DayOverrideOmit<ExtArgs> | null
    /**
     * Filter, which DayOverride to fetch.
     */
    where?: DayOverrideWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DayOverrides to fetch.
     */
    orderBy?: DayOverrideOrderByWithRelationInput | DayOverrideOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for DayOverrides.
     */
    cursor?: DayOverrideWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DayOverrides from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DayOverrides.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of DayOverrides.
     */
    distinct?: DayOverrideScalarFieldEnum | DayOverrideScalarFieldEnum[]
  }

  /**
   * DayOverride findFirstOrThrow
   */
  export type DayOverrideFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DayOverride
     */
    select?: DayOverrideSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DayOverride
     */
    omit?: DayOverrideOmit<ExtArgs> | null
    /**
     * Filter, which DayOverride to fetch.
     */
    where?: DayOverrideWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DayOverrides to fetch.
     */
    orderBy?: DayOverrideOrderByWithRelationInput | DayOverrideOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for DayOverrides.
     */
    cursor?: DayOverrideWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DayOverrides from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DayOverrides.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of DayOverrides.
     */
    distinct?: DayOverrideScalarFieldEnum | DayOverrideScalarFieldEnum[]
  }

  /**
   * DayOverride findMany
   */
  export type DayOverrideFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DayOverride
     */
    select?: DayOverrideSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DayOverride
     */
    omit?: DayOverrideOmit<ExtArgs> | null
    /**
     * Filter, which DayOverrides to fetch.
     */
    where?: DayOverrideWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DayOverrides to fetch.
     */
    orderBy?: DayOverrideOrderByWithRelationInput | DayOverrideOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing DayOverrides.
     */
    cursor?: DayOverrideWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DayOverrides from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DayOverrides.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of DayOverrides.
     */
    distinct?: DayOverrideScalarFieldEnum | DayOverrideScalarFieldEnum[]
  }

  /**
   * DayOverride create
   */
  export type DayOverrideCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DayOverride
     */
    select?: DayOverrideSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DayOverride
     */
    omit?: DayOverrideOmit<ExtArgs> | null
    /**
     * The data needed to create a DayOverride.
     */
    data: XOR<DayOverrideCreateInput, DayOverrideUncheckedCreateInput>
  }

  /**
   * DayOverride createMany
   */
  export type DayOverrideCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many DayOverrides.
     */
    data: DayOverrideCreateManyInput | DayOverrideCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * DayOverride createManyAndReturn
   */
  export type DayOverrideCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DayOverride
     */
    select?: DayOverrideSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the DayOverride
     */
    omit?: DayOverrideOmit<ExtArgs> | null
    /**
     * The data used to create many DayOverrides.
     */
    data: DayOverrideCreateManyInput | DayOverrideCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * DayOverride update
   */
  export type DayOverrideUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DayOverride
     */
    select?: DayOverrideSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DayOverride
     */
    omit?: DayOverrideOmit<ExtArgs> | null
    /**
     * The data needed to update a DayOverride.
     */
    data: XOR<DayOverrideUpdateInput, DayOverrideUncheckedUpdateInput>
    /**
     * Choose, which DayOverride to update.
     */
    where: DayOverrideWhereUniqueInput
  }

  /**
   * DayOverride updateMany
   */
  export type DayOverrideUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update DayOverrides.
     */
    data: XOR<DayOverrideUpdateManyMutationInput, DayOverrideUncheckedUpdateManyInput>
    /**
     * Filter which DayOverrides to update
     */
    where?: DayOverrideWhereInput
    /**
     * Limit how many DayOverrides to update.
     */
    limit?: number
  }

  /**
   * DayOverride updateManyAndReturn
   */
  export type DayOverrideUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DayOverride
     */
    select?: DayOverrideSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the DayOverride
     */
    omit?: DayOverrideOmit<ExtArgs> | null
    /**
     * The data used to update DayOverrides.
     */
    data: XOR<DayOverrideUpdateManyMutationInput, DayOverrideUncheckedUpdateManyInput>
    /**
     * Filter which DayOverrides to update
     */
    where?: DayOverrideWhereInput
    /**
     * Limit how many DayOverrides to update.
     */
    limit?: number
  }

  /**
   * DayOverride upsert
   */
  export type DayOverrideUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DayOverride
     */
    select?: DayOverrideSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DayOverride
     */
    omit?: DayOverrideOmit<ExtArgs> | null
    /**
     * The filter to search for the DayOverride to update in case it exists.
     */
    where: DayOverrideWhereUniqueInput
    /**
     * In case the DayOverride found by the `where` argument doesn't exist, create a new DayOverride with this data.
     */
    create: XOR<DayOverrideCreateInput, DayOverrideUncheckedCreateInput>
    /**
     * In case the DayOverride was found with the provided `where` argument, update it with this data.
     */
    update: XOR<DayOverrideUpdateInput, DayOverrideUncheckedUpdateInput>
  }

  /**
   * DayOverride delete
   */
  export type DayOverrideDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DayOverride
     */
    select?: DayOverrideSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DayOverride
     */
    omit?: DayOverrideOmit<ExtArgs> | null
    /**
     * Filter which DayOverride to delete.
     */
    where: DayOverrideWhereUniqueInput
  }

  /**
   * DayOverride deleteMany
   */
  export type DayOverrideDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which DayOverrides to delete
     */
    where?: DayOverrideWhereInput
    /**
     * Limit how many DayOverrides to delete.
     */
    limit?: number
  }

  /**
   * DayOverride without action
   */
  export type DayOverrideDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DayOverride
     */
    select?: DayOverrideSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DayOverride
     */
    omit?: DayOverrideOmit<ExtArgs> | null
  }


  /**
   * Model GiftCard
   */

  export type AggregateGiftCard = {
    _count: GiftCardCountAggregateOutputType | null
    _avg: GiftCardAvgAggregateOutputType | null
    _sum: GiftCardSumAggregateOutputType | null
    _min: GiftCardMinAggregateOutputType | null
    _max: GiftCardMaxAggregateOutputType | null
  }

  export type GiftCardAvgAggregateOutputType = {
    amount: number | null
  }

  export type GiftCardSumAggregateOutputType = {
    amount: number | null
  }

  export type GiftCardMinAggregateOutputType = {
    id: string | null
    createdAt: Date | null
    updatedAt: Date | null
    code: string | null
    amount: number | null
    recipientEmail: string | null
    personalMessage: string | null
    isPaid: boolean | null
    status: $Enums.GiftCardStatus | null
    stripeSessionId: string | null
    expiresAt: Date | null
    transactionExpireAt: Date | null
    usedAt: Date | null
  }

  export type GiftCardMaxAggregateOutputType = {
    id: string | null
    createdAt: Date | null
    updatedAt: Date | null
    code: string | null
    amount: number | null
    recipientEmail: string | null
    personalMessage: string | null
    isPaid: boolean | null
    status: $Enums.GiftCardStatus | null
    stripeSessionId: string | null
    expiresAt: Date | null
    transactionExpireAt: Date | null
    usedAt: Date | null
  }

  export type GiftCardCountAggregateOutputType = {
    id: number
    createdAt: number
    updatedAt: number
    code: number
    amount: number
    recipientEmail: number
    personalMessage: number
    isPaid: number
    status: number
    stripeSessionId: number
    expiresAt: number
    transactionExpireAt: number
    usedAt: number
    _all: number
  }


  export type GiftCardAvgAggregateInputType = {
    amount?: true
  }

  export type GiftCardSumAggregateInputType = {
    amount?: true
  }

  export type GiftCardMinAggregateInputType = {
    id?: true
    createdAt?: true
    updatedAt?: true
    code?: true
    amount?: true
    recipientEmail?: true
    personalMessage?: true
    isPaid?: true
    status?: true
    stripeSessionId?: true
    expiresAt?: true
    transactionExpireAt?: true
    usedAt?: true
  }

  export type GiftCardMaxAggregateInputType = {
    id?: true
    createdAt?: true
    updatedAt?: true
    code?: true
    amount?: true
    recipientEmail?: true
    personalMessage?: true
    isPaid?: true
    status?: true
    stripeSessionId?: true
    expiresAt?: true
    transactionExpireAt?: true
    usedAt?: true
  }

  export type GiftCardCountAggregateInputType = {
    id?: true
    createdAt?: true
    updatedAt?: true
    code?: true
    amount?: true
    recipientEmail?: true
    personalMessage?: true
    isPaid?: true
    status?: true
    stripeSessionId?: true
    expiresAt?: true
    transactionExpireAt?: true
    usedAt?: true
    _all?: true
  }

  export type GiftCardAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which GiftCard to aggregate.
     */
    where?: GiftCardWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GiftCards to fetch.
     */
    orderBy?: GiftCardOrderByWithRelationInput | GiftCardOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: GiftCardWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GiftCards from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GiftCards.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned GiftCards
    **/
    _count?: true | GiftCardCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: GiftCardAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: GiftCardSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: GiftCardMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: GiftCardMaxAggregateInputType
  }

  export type GetGiftCardAggregateType<T extends GiftCardAggregateArgs> = {
        [P in keyof T & keyof AggregateGiftCard]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateGiftCard[P]>
      : GetScalarType<T[P], AggregateGiftCard[P]>
  }




  export type GiftCardGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: GiftCardWhereInput
    orderBy?: GiftCardOrderByWithAggregationInput | GiftCardOrderByWithAggregationInput[]
    by: GiftCardScalarFieldEnum[] | GiftCardScalarFieldEnum
    having?: GiftCardScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: GiftCardCountAggregateInputType | true
    _avg?: GiftCardAvgAggregateInputType
    _sum?: GiftCardSumAggregateInputType
    _min?: GiftCardMinAggregateInputType
    _max?: GiftCardMaxAggregateInputType
  }

  export type GiftCardGroupByOutputType = {
    id: string
    createdAt: Date
    updatedAt: Date
    code: string
    amount: number
    recipientEmail: string | null
    personalMessage: string | null
    isPaid: boolean
    status: $Enums.GiftCardStatus
    stripeSessionId: string | null
    expiresAt: Date | null
    transactionExpireAt: Date | null
    usedAt: Date | null
    _count: GiftCardCountAggregateOutputType | null
    _avg: GiftCardAvgAggregateOutputType | null
    _sum: GiftCardSumAggregateOutputType | null
    _min: GiftCardMinAggregateOutputType | null
    _max: GiftCardMaxAggregateOutputType | null
  }

  type GetGiftCardGroupByPayload<T extends GiftCardGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<GiftCardGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof GiftCardGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], GiftCardGroupByOutputType[P]>
            : GetScalarType<T[P], GiftCardGroupByOutputType[P]>
        }
      >
    >


  export type GiftCardSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    code?: boolean
    amount?: boolean
    recipientEmail?: boolean
    personalMessage?: boolean
    isPaid?: boolean
    status?: boolean
    stripeSessionId?: boolean
    expiresAt?: boolean
    transactionExpireAt?: boolean
    usedAt?: boolean
  }, ExtArgs["result"]["giftCard"]>

  export type GiftCardSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    code?: boolean
    amount?: boolean
    recipientEmail?: boolean
    personalMessage?: boolean
    isPaid?: boolean
    status?: boolean
    stripeSessionId?: boolean
    expiresAt?: boolean
    transactionExpireAt?: boolean
    usedAt?: boolean
  }, ExtArgs["result"]["giftCard"]>

  export type GiftCardSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    code?: boolean
    amount?: boolean
    recipientEmail?: boolean
    personalMessage?: boolean
    isPaid?: boolean
    status?: boolean
    stripeSessionId?: boolean
    expiresAt?: boolean
    transactionExpireAt?: boolean
    usedAt?: boolean
  }, ExtArgs["result"]["giftCard"]>

  export type GiftCardSelectScalar = {
    id?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    code?: boolean
    amount?: boolean
    recipientEmail?: boolean
    personalMessage?: boolean
    isPaid?: boolean
    status?: boolean
    stripeSessionId?: boolean
    expiresAt?: boolean
    transactionExpireAt?: boolean
    usedAt?: boolean
  }

  export type GiftCardOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "createdAt" | "updatedAt" | "code" | "amount" | "recipientEmail" | "personalMessage" | "isPaid" | "status" | "stripeSessionId" | "expiresAt" | "transactionExpireAt" | "usedAt", ExtArgs["result"]["giftCard"]>

  export type $GiftCardPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "GiftCard"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      createdAt: Date
      updatedAt: Date
      code: string
      amount: number
      recipientEmail: string | null
      personalMessage: string | null
      isPaid: boolean
      status: $Enums.GiftCardStatus
      stripeSessionId: string | null
      expiresAt: Date | null
      transactionExpireAt: Date | null
      usedAt: Date | null
    }, ExtArgs["result"]["giftCard"]>
    composites: {}
  }

  type GiftCardGetPayload<S extends boolean | null | undefined | GiftCardDefaultArgs> = $Result.GetResult<Prisma.$GiftCardPayload, S>

  type GiftCardCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<GiftCardFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: GiftCardCountAggregateInputType | true
    }

  export interface GiftCardDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['GiftCard'], meta: { name: 'GiftCard' } }
    /**
     * Find zero or one GiftCard that matches the filter.
     * @param {GiftCardFindUniqueArgs} args - Arguments to find a GiftCard
     * @example
     * // Get one GiftCard
     * const giftCard = await prisma.giftCard.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends GiftCardFindUniqueArgs>(args: SelectSubset<T, GiftCardFindUniqueArgs<ExtArgs>>): Prisma__GiftCardClient<$Result.GetResult<Prisma.$GiftCardPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one GiftCard that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {GiftCardFindUniqueOrThrowArgs} args - Arguments to find a GiftCard
     * @example
     * // Get one GiftCard
     * const giftCard = await prisma.giftCard.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends GiftCardFindUniqueOrThrowArgs>(args: SelectSubset<T, GiftCardFindUniqueOrThrowArgs<ExtArgs>>): Prisma__GiftCardClient<$Result.GetResult<Prisma.$GiftCardPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first GiftCard that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GiftCardFindFirstArgs} args - Arguments to find a GiftCard
     * @example
     * // Get one GiftCard
     * const giftCard = await prisma.giftCard.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends GiftCardFindFirstArgs>(args?: SelectSubset<T, GiftCardFindFirstArgs<ExtArgs>>): Prisma__GiftCardClient<$Result.GetResult<Prisma.$GiftCardPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first GiftCard that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GiftCardFindFirstOrThrowArgs} args - Arguments to find a GiftCard
     * @example
     * // Get one GiftCard
     * const giftCard = await prisma.giftCard.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends GiftCardFindFirstOrThrowArgs>(args?: SelectSubset<T, GiftCardFindFirstOrThrowArgs<ExtArgs>>): Prisma__GiftCardClient<$Result.GetResult<Prisma.$GiftCardPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more GiftCards that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GiftCardFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all GiftCards
     * const giftCards = await prisma.giftCard.findMany()
     * 
     * // Get first 10 GiftCards
     * const giftCards = await prisma.giftCard.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const giftCardWithIdOnly = await prisma.giftCard.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends GiftCardFindManyArgs>(args?: SelectSubset<T, GiftCardFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GiftCardPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a GiftCard.
     * @param {GiftCardCreateArgs} args - Arguments to create a GiftCard.
     * @example
     * // Create one GiftCard
     * const GiftCard = await prisma.giftCard.create({
     *   data: {
     *     // ... data to create a GiftCard
     *   }
     * })
     * 
     */
    create<T extends GiftCardCreateArgs>(args: SelectSubset<T, GiftCardCreateArgs<ExtArgs>>): Prisma__GiftCardClient<$Result.GetResult<Prisma.$GiftCardPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many GiftCards.
     * @param {GiftCardCreateManyArgs} args - Arguments to create many GiftCards.
     * @example
     * // Create many GiftCards
     * const giftCard = await prisma.giftCard.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends GiftCardCreateManyArgs>(args?: SelectSubset<T, GiftCardCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many GiftCards and returns the data saved in the database.
     * @param {GiftCardCreateManyAndReturnArgs} args - Arguments to create many GiftCards.
     * @example
     * // Create many GiftCards
     * const giftCard = await prisma.giftCard.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many GiftCards and only return the `id`
     * const giftCardWithIdOnly = await prisma.giftCard.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends GiftCardCreateManyAndReturnArgs>(args?: SelectSubset<T, GiftCardCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GiftCardPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a GiftCard.
     * @param {GiftCardDeleteArgs} args - Arguments to delete one GiftCard.
     * @example
     * // Delete one GiftCard
     * const GiftCard = await prisma.giftCard.delete({
     *   where: {
     *     // ... filter to delete one GiftCard
     *   }
     * })
     * 
     */
    delete<T extends GiftCardDeleteArgs>(args: SelectSubset<T, GiftCardDeleteArgs<ExtArgs>>): Prisma__GiftCardClient<$Result.GetResult<Prisma.$GiftCardPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one GiftCard.
     * @param {GiftCardUpdateArgs} args - Arguments to update one GiftCard.
     * @example
     * // Update one GiftCard
     * const giftCard = await prisma.giftCard.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends GiftCardUpdateArgs>(args: SelectSubset<T, GiftCardUpdateArgs<ExtArgs>>): Prisma__GiftCardClient<$Result.GetResult<Prisma.$GiftCardPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more GiftCards.
     * @param {GiftCardDeleteManyArgs} args - Arguments to filter GiftCards to delete.
     * @example
     * // Delete a few GiftCards
     * const { count } = await prisma.giftCard.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends GiftCardDeleteManyArgs>(args?: SelectSubset<T, GiftCardDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more GiftCards.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GiftCardUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many GiftCards
     * const giftCard = await prisma.giftCard.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends GiftCardUpdateManyArgs>(args: SelectSubset<T, GiftCardUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more GiftCards and returns the data updated in the database.
     * @param {GiftCardUpdateManyAndReturnArgs} args - Arguments to update many GiftCards.
     * @example
     * // Update many GiftCards
     * const giftCard = await prisma.giftCard.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more GiftCards and only return the `id`
     * const giftCardWithIdOnly = await prisma.giftCard.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends GiftCardUpdateManyAndReturnArgs>(args: SelectSubset<T, GiftCardUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GiftCardPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one GiftCard.
     * @param {GiftCardUpsertArgs} args - Arguments to update or create a GiftCard.
     * @example
     * // Update or create a GiftCard
     * const giftCard = await prisma.giftCard.upsert({
     *   create: {
     *     // ... data to create a GiftCard
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the GiftCard we want to update
     *   }
     * })
     */
    upsert<T extends GiftCardUpsertArgs>(args: SelectSubset<T, GiftCardUpsertArgs<ExtArgs>>): Prisma__GiftCardClient<$Result.GetResult<Prisma.$GiftCardPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of GiftCards.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GiftCardCountArgs} args - Arguments to filter GiftCards to count.
     * @example
     * // Count the number of GiftCards
     * const count = await prisma.giftCard.count({
     *   where: {
     *     // ... the filter for the GiftCards we want to count
     *   }
     * })
    **/
    count<T extends GiftCardCountArgs>(
      args?: Subset<T, GiftCardCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], GiftCardCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a GiftCard.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GiftCardAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends GiftCardAggregateArgs>(args: Subset<T, GiftCardAggregateArgs>): Prisma.PrismaPromise<GetGiftCardAggregateType<T>>

    /**
     * Group by GiftCard.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GiftCardGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends GiftCardGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: GiftCardGroupByArgs['orderBy'] }
        : { orderBy?: GiftCardGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, GiftCardGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetGiftCardGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the GiftCard model
   */
  readonly fields: GiftCardFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for GiftCard.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__GiftCardClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the GiftCard model
   */
  interface GiftCardFieldRefs {
    readonly id: FieldRef<"GiftCard", 'String'>
    readonly createdAt: FieldRef<"GiftCard", 'DateTime'>
    readonly updatedAt: FieldRef<"GiftCard", 'DateTime'>
    readonly code: FieldRef<"GiftCard", 'String'>
    readonly amount: FieldRef<"GiftCard", 'Float'>
    readonly recipientEmail: FieldRef<"GiftCard", 'String'>
    readonly personalMessage: FieldRef<"GiftCard", 'String'>
    readonly isPaid: FieldRef<"GiftCard", 'Boolean'>
    readonly status: FieldRef<"GiftCard", 'GiftCardStatus'>
    readonly stripeSessionId: FieldRef<"GiftCard", 'String'>
    readonly expiresAt: FieldRef<"GiftCard", 'DateTime'>
    readonly transactionExpireAt: FieldRef<"GiftCard", 'DateTime'>
    readonly usedAt: FieldRef<"GiftCard", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * GiftCard findUnique
   */
  export type GiftCardFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GiftCard
     */
    select?: GiftCardSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GiftCard
     */
    omit?: GiftCardOmit<ExtArgs> | null
    /**
     * Filter, which GiftCard to fetch.
     */
    where: GiftCardWhereUniqueInput
  }

  /**
   * GiftCard findUniqueOrThrow
   */
  export type GiftCardFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GiftCard
     */
    select?: GiftCardSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GiftCard
     */
    omit?: GiftCardOmit<ExtArgs> | null
    /**
     * Filter, which GiftCard to fetch.
     */
    where: GiftCardWhereUniqueInput
  }

  /**
   * GiftCard findFirst
   */
  export type GiftCardFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GiftCard
     */
    select?: GiftCardSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GiftCard
     */
    omit?: GiftCardOmit<ExtArgs> | null
    /**
     * Filter, which GiftCard to fetch.
     */
    where?: GiftCardWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GiftCards to fetch.
     */
    orderBy?: GiftCardOrderByWithRelationInput | GiftCardOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for GiftCards.
     */
    cursor?: GiftCardWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GiftCards from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GiftCards.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of GiftCards.
     */
    distinct?: GiftCardScalarFieldEnum | GiftCardScalarFieldEnum[]
  }

  /**
   * GiftCard findFirstOrThrow
   */
  export type GiftCardFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GiftCard
     */
    select?: GiftCardSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GiftCard
     */
    omit?: GiftCardOmit<ExtArgs> | null
    /**
     * Filter, which GiftCard to fetch.
     */
    where?: GiftCardWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GiftCards to fetch.
     */
    orderBy?: GiftCardOrderByWithRelationInput | GiftCardOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for GiftCards.
     */
    cursor?: GiftCardWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GiftCards from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GiftCards.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of GiftCards.
     */
    distinct?: GiftCardScalarFieldEnum | GiftCardScalarFieldEnum[]
  }

  /**
   * GiftCard findMany
   */
  export type GiftCardFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GiftCard
     */
    select?: GiftCardSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GiftCard
     */
    omit?: GiftCardOmit<ExtArgs> | null
    /**
     * Filter, which GiftCards to fetch.
     */
    where?: GiftCardWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GiftCards to fetch.
     */
    orderBy?: GiftCardOrderByWithRelationInput | GiftCardOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing GiftCards.
     */
    cursor?: GiftCardWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GiftCards from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GiftCards.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of GiftCards.
     */
    distinct?: GiftCardScalarFieldEnum | GiftCardScalarFieldEnum[]
  }

  /**
   * GiftCard create
   */
  export type GiftCardCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GiftCard
     */
    select?: GiftCardSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GiftCard
     */
    omit?: GiftCardOmit<ExtArgs> | null
    /**
     * The data needed to create a GiftCard.
     */
    data: XOR<GiftCardCreateInput, GiftCardUncheckedCreateInput>
  }

  /**
   * GiftCard createMany
   */
  export type GiftCardCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many GiftCards.
     */
    data: GiftCardCreateManyInput | GiftCardCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * GiftCard createManyAndReturn
   */
  export type GiftCardCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GiftCard
     */
    select?: GiftCardSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the GiftCard
     */
    omit?: GiftCardOmit<ExtArgs> | null
    /**
     * The data used to create many GiftCards.
     */
    data: GiftCardCreateManyInput | GiftCardCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * GiftCard update
   */
  export type GiftCardUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GiftCard
     */
    select?: GiftCardSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GiftCard
     */
    omit?: GiftCardOmit<ExtArgs> | null
    /**
     * The data needed to update a GiftCard.
     */
    data: XOR<GiftCardUpdateInput, GiftCardUncheckedUpdateInput>
    /**
     * Choose, which GiftCard to update.
     */
    where: GiftCardWhereUniqueInput
  }

  /**
   * GiftCard updateMany
   */
  export type GiftCardUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update GiftCards.
     */
    data: XOR<GiftCardUpdateManyMutationInput, GiftCardUncheckedUpdateManyInput>
    /**
     * Filter which GiftCards to update
     */
    where?: GiftCardWhereInput
    /**
     * Limit how many GiftCards to update.
     */
    limit?: number
  }

  /**
   * GiftCard updateManyAndReturn
   */
  export type GiftCardUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GiftCard
     */
    select?: GiftCardSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the GiftCard
     */
    omit?: GiftCardOmit<ExtArgs> | null
    /**
     * The data used to update GiftCards.
     */
    data: XOR<GiftCardUpdateManyMutationInput, GiftCardUncheckedUpdateManyInput>
    /**
     * Filter which GiftCards to update
     */
    where?: GiftCardWhereInput
    /**
     * Limit how many GiftCards to update.
     */
    limit?: number
  }

  /**
   * GiftCard upsert
   */
  export type GiftCardUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GiftCard
     */
    select?: GiftCardSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GiftCard
     */
    omit?: GiftCardOmit<ExtArgs> | null
    /**
     * The filter to search for the GiftCard to update in case it exists.
     */
    where: GiftCardWhereUniqueInput
    /**
     * In case the GiftCard found by the `where` argument doesn't exist, create a new GiftCard with this data.
     */
    create: XOR<GiftCardCreateInput, GiftCardUncheckedCreateInput>
    /**
     * In case the GiftCard was found with the provided `where` argument, update it with this data.
     */
    update: XOR<GiftCardUpdateInput, GiftCardUncheckedUpdateInput>
  }

  /**
   * GiftCard delete
   */
  export type GiftCardDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GiftCard
     */
    select?: GiftCardSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GiftCard
     */
    omit?: GiftCardOmit<ExtArgs> | null
    /**
     * Filter which GiftCard to delete.
     */
    where: GiftCardWhereUniqueInput
  }

  /**
   * GiftCard deleteMany
   */
  export type GiftCardDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which GiftCards to delete
     */
    where?: GiftCardWhereInput
    /**
     * Limit how many GiftCards to delete.
     */
    limit?: number
  }

  /**
   * GiftCard without action
   */
  export type GiftCardDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GiftCard
     */
    select?: GiftCardSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GiftCard
     */
    omit?: GiftCardOmit<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const ReservationScalarFieldEnum: {
    id: 'id',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    name: 'name',
    email: 'email',
    phone: 'phone',
    date: 'date',
    guests: 'guests',
    specialRequest: 'specialRequest',
    wantsSmsReminder: 'wantsSmsReminder',
    status: 'status',
    stripeSessionId: 'stripeSessionId',
    expiresAt: 'expiresAt',
    transactionExpireAt: 'transactionExpireAt',
    reminderEmailSent: 'reminderEmailSent',
    reminderSmsSent: 'reminderSmsSent',
    cancelToken: 'cancelToken'
  };

  export type ReservationScalarFieldEnum = (typeof ReservationScalarFieldEnum)[keyof typeof ReservationScalarFieldEnum]


  export const AdminScalarFieldEnum: {
    id: 'id',
    email: 'email',
    passwordHash: 'passwordHash',
    createdAt: 'createdAt'
  };

  export type AdminScalarFieldEnum = (typeof AdminScalarFieldEnum)[keyof typeof AdminScalarFieldEnum]


  export const RestaurantSettingsScalarFieldEnum: {
    id: 'id',
    maxCovers: 'maxCovers',
    mealDuration: 'mealDuration',
    openingDays: 'openingDays',
    openingSlots: 'openingSlots',
    depositPerGuestCents: 'depositPerGuestCents'
  };

  export type RestaurantSettingsScalarFieldEnum = (typeof RestaurantSettingsScalarFieldEnum)[keyof typeof RestaurantSettingsScalarFieldEnum]


  export const DayOverrideScalarFieldEnum: {
    id: 'id',
    date: 'date',
    closed: 'closed',
    maxCovers: 'maxCovers',
    openingSlots: 'openingSlots'
  };

  export type DayOverrideScalarFieldEnum = (typeof DayOverrideScalarFieldEnum)[keyof typeof DayOverrideScalarFieldEnum]


  export const GiftCardScalarFieldEnum: {
    id: 'id',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    code: 'code',
    amount: 'amount',
    recipientEmail: 'recipientEmail',
    personalMessage: 'personalMessage',
    isPaid: 'isPaid',
    status: 'status',
    stripeSessionId: 'stripeSessionId',
    expiresAt: 'expiresAt',
    transactionExpireAt: 'transactionExpireAt',
    usedAt: 'usedAt'
  };

  export type GiftCardScalarFieldEnum = (typeof GiftCardScalarFieldEnum)[keyof typeof GiftCardScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'ReservationStatus'
   */
  export type EnumReservationStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ReservationStatus'>
    


  /**
   * Reference to a field of type 'ReservationStatus[]'
   */
  export type ListEnumReservationStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ReservationStatus[]'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    


  /**
   * Reference to a field of type 'GiftCardStatus'
   */
  export type EnumGiftCardStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'GiftCardStatus'>
    


  /**
   * Reference to a field of type 'GiftCardStatus[]'
   */
  export type ListEnumGiftCardStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'GiftCardStatus[]'>
    
  /**
   * Deep Input Types
   */


  export type ReservationWhereInput = {
    AND?: ReservationWhereInput | ReservationWhereInput[]
    OR?: ReservationWhereInput[]
    NOT?: ReservationWhereInput | ReservationWhereInput[]
    id?: StringFilter<"Reservation"> | string
    createdAt?: DateTimeFilter<"Reservation"> | Date | string
    updatedAt?: DateTimeFilter<"Reservation"> | Date | string
    name?: StringFilter<"Reservation"> | string
    email?: StringFilter<"Reservation"> | string
    phone?: StringNullableFilter<"Reservation"> | string | null
    date?: DateTimeFilter<"Reservation"> | Date | string
    guests?: IntFilter<"Reservation"> | number
    specialRequest?: StringNullableFilter<"Reservation"> | string | null
    wantsSmsReminder?: BoolFilter<"Reservation"> | boolean
    status?: EnumReservationStatusFilter<"Reservation"> | $Enums.ReservationStatus
    stripeSessionId?: StringNullableFilter<"Reservation"> | string | null
    expiresAt?: DateTimeNullableFilter<"Reservation"> | Date | string | null
    transactionExpireAt?: DateTimeNullableFilter<"Reservation"> | Date | string | null
    reminderEmailSent?: BoolFilter<"Reservation"> | boolean
    reminderSmsSent?: BoolFilter<"Reservation"> | boolean
    cancelToken?: StringFilter<"Reservation"> | string
  }

  export type ReservationOrderByWithRelationInput = {
    id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    name?: SortOrder
    email?: SortOrder
    phone?: SortOrderInput | SortOrder
    date?: SortOrder
    guests?: SortOrder
    specialRequest?: SortOrderInput | SortOrder
    wantsSmsReminder?: SortOrder
    status?: SortOrder
    stripeSessionId?: SortOrderInput | SortOrder
    expiresAt?: SortOrderInput | SortOrder
    transactionExpireAt?: SortOrderInput | SortOrder
    reminderEmailSent?: SortOrder
    reminderSmsSent?: SortOrder
    cancelToken?: SortOrder
  }

  export type ReservationWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    stripeSessionId?: string
    cancelToken?: string
    AND?: ReservationWhereInput | ReservationWhereInput[]
    OR?: ReservationWhereInput[]
    NOT?: ReservationWhereInput | ReservationWhereInput[]
    createdAt?: DateTimeFilter<"Reservation"> | Date | string
    updatedAt?: DateTimeFilter<"Reservation"> | Date | string
    name?: StringFilter<"Reservation"> | string
    email?: StringFilter<"Reservation"> | string
    phone?: StringNullableFilter<"Reservation"> | string | null
    date?: DateTimeFilter<"Reservation"> | Date | string
    guests?: IntFilter<"Reservation"> | number
    specialRequest?: StringNullableFilter<"Reservation"> | string | null
    wantsSmsReminder?: BoolFilter<"Reservation"> | boolean
    status?: EnumReservationStatusFilter<"Reservation"> | $Enums.ReservationStatus
    expiresAt?: DateTimeNullableFilter<"Reservation"> | Date | string | null
    transactionExpireAt?: DateTimeNullableFilter<"Reservation"> | Date | string | null
    reminderEmailSent?: BoolFilter<"Reservation"> | boolean
    reminderSmsSent?: BoolFilter<"Reservation"> | boolean
  }, "id" | "stripeSessionId" | "cancelToken">

  export type ReservationOrderByWithAggregationInput = {
    id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    name?: SortOrder
    email?: SortOrder
    phone?: SortOrderInput | SortOrder
    date?: SortOrder
    guests?: SortOrder
    specialRequest?: SortOrderInput | SortOrder
    wantsSmsReminder?: SortOrder
    status?: SortOrder
    stripeSessionId?: SortOrderInput | SortOrder
    expiresAt?: SortOrderInput | SortOrder
    transactionExpireAt?: SortOrderInput | SortOrder
    reminderEmailSent?: SortOrder
    reminderSmsSent?: SortOrder
    cancelToken?: SortOrder
    _count?: ReservationCountOrderByAggregateInput
    _avg?: ReservationAvgOrderByAggregateInput
    _max?: ReservationMaxOrderByAggregateInput
    _min?: ReservationMinOrderByAggregateInput
    _sum?: ReservationSumOrderByAggregateInput
  }

  export type ReservationScalarWhereWithAggregatesInput = {
    AND?: ReservationScalarWhereWithAggregatesInput | ReservationScalarWhereWithAggregatesInput[]
    OR?: ReservationScalarWhereWithAggregatesInput[]
    NOT?: ReservationScalarWhereWithAggregatesInput | ReservationScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Reservation"> | string
    createdAt?: DateTimeWithAggregatesFilter<"Reservation"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Reservation"> | Date | string
    name?: StringWithAggregatesFilter<"Reservation"> | string
    email?: StringWithAggregatesFilter<"Reservation"> | string
    phone?: StringNullableWithAggregatesFilter<"Reservation"> | string | null
    date?: DateTimeWithAggregatesFilter<"Reservation"> | Date | string
    guests?: IntWithAggregatesFilter<"Reservation"> | number
    specialRequest?: StringNullableWithAggregatesFilter<"Reservation"> | string | null
    wantsSmsReminder?: BoolWithAggregatesFilter<"Reservation"> | boolean
    status?: EnumReservationStatusWithAggregatesFilter<"Reservation"> | $Enums.ReservationStatus
    stripeSessionId?: StringNullableWithAggregatesFilter<"Reservation"> | string | null
    expiresAt?: DateTimeNullableWithAggregatesFilter<"Reservation"> | Date | string | null
    transactionExpireAt?: DateTimeNullableWithAggregatesFilter<"Reservation"> | Date | string | null
    reminderEmailSent?: BoolWithAggregatesFilter<"Reservation"> | boolean
    reminderSmsSent?: BoolWithAggregatesFilter<"Reservation"> | boolean
    cancelToken?: StringWithAggregatesFilter<"Reservation"> | string
  }

  export type AdminWhereInput = {
    AND?: AdminWhereInput | AdminWhereInput[]
    OR?: AdminWhereInput[]
    NOT?: AdminWhereInput | AdminWhereInput[]
    id?: IntFilter<"Admin"> | number
    email?: StringFilter<"Admin"> | string
    passwordHash?: StringFilter<"Admin"> | string
    createdAt?: DateTimeFilter<"Admin"> | Date | string
  }

  export type AdminOrderByWithRelationInput = {
    id?: SortOrder
    email?: SortOrder
    passwordHash?: SortOrder
    createdAt?: SortOrder
  }

  export type AdminWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    email?: string
    AND?: AdminWhereInput | AdminWhereInput[]
    OR?: AdminWhereInput[]
    NOT?: AdminWhereInput | AdminWhereInput[]
    passwordHash?: StringFilter<"Admin"> | string
    createdAt?: DateTimeFilter<"Admin"> | Date | string
  }, "id" | "email">

  export type AdminOrderByWithAggregationInput = {
    id?: SortOrder
    email?: SortOrder
    passwordHash?: SortOrder
    createdAt?: SortOrder
    _count?: AdminCountOrderByAggregateInput
    _avg?: AdminAvgOrderByAggregateInput
    _max?: AdminMaxOrderByAggregateInput
    _min?: AdminMinOrderByAggregateInput
    _sum?: AdminSumOrderByAggregateInput
  }

  export type AdminScalarWhereWithAggregatesInput = {
    AND?: AdminScalarWhereWithAggregatesInput | AdminScalarWhereWithAggregatesInput[]
    OR?: AdminScalarWhereWithAggregatesInput[]
    NOT?: AdminScalarWhereWithAggregatesInput | AdminScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"Admin"> | number
    email?: StringWithAggregatesFilter<"Admin"> | string
    passwordHash?: StringWithAggregatesFilter<"Admin"> | string
    createdAt?: DateTimeWithAggregatesFilter<"Admin"> | Date | string
  }

  export type RestaurantSettingsWhereInput = {
    AND?: RestaurantSettingsWhereInput | RestaurantSettingsWhereInput[]
    OR?: RestaurantSettingsWhereInput[]
    NOT?: RestaurantSettingsWhereInput | RestaurantSettingsWhereInput[]
    id?: IntFilter<"RestaurantSettings"> | number
    maxCovers?: IntFilter<"RestaurantSettings"> | number
    mealDuration?: IntFilter<"RestaurantSettings"> | number
    openingDays?: StringFilter<"RestaurantSettings"> | string
    openingSlots?: StringFilter<"RestaurantSettings"> | string
    depositPerGuestCents?: IntFilter<"RestaurantSettings"> | number
  }

  export type RestaurantSettingsOrderByWithRelationInput = {
    id?: SortOrder
    maxCovers?: SortOrder
    mealDuration?: SortOrder
    openingDays?: SortOrder
    openingSlots?: SortOrder
    depositPerGuestCents?: SortOrder
  }

  export type RestaurantSettingsWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: RestaurantSettingsWhereInput | RestaurantSettingsWhereInput[]
    OR?: RestaurantSettingsWhereInput[]
    NOT?: RestaurantSettingsWhereInput | RestaurantSettingsWhereInput[]
    maxCovers?: IntFilter<"RestaurantSettings"> | number
    mealDuration?: IntFilter<"RestaurantSettings"> | number
    openingDays?: StringFilter<"RestaurantSettings"> | string
    openingSlots?: StringFilter<"RestaurantSettings"> | string
    depositPerGuestCents?: IntFilter<"RestaurantSettings"> | number
  }, "id">

  export type RestaurantSettingsOrderByWithAggregationInput = {
    id?: SortOrder
    maxCovers?: SortOrder
    mealDuration?: SortOrder
    openingDays?: SortOrder
    openingSlots?: SortOrder
    depositPerGuestCents?: SortOrder
    _count?: RestaurantSettingsCountOrderByAggregateInput
    _avg?: RestaurantSettingsAvgOrderByAggregateInput
    _max?: RestaurantSettingsMaxOrderByAggregateInput
    _min?: RestaurantSettingsMinOrderByAggregateInput
    _sum?: RestaurantSettingsSumOrderByAggregateInput
  }

  export type RestaurantSettingsScalarWhereWithAggregatesInput = {
    AND?: RestaurantSettingsScalarWhereWithAggregatesInput | RestaurantSettingsScalarWhereWithAggregatesInput[]
    OR?: RestaurantSettingsScalarWhereWithAggregatesInput[]
    NOT?: RestaurantSettingsScalarWhereWithAggregatesInput | RestaurantSettingsScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"RestaurantSettings"> | number
    maxCovers?: IntWithAggregatesFilter<"RestaurantSettings"> | number
    mealDuration?: IntWithAggregatesFilter<"RestaurantSettings"> | number
    openingDays?: StringWithAggregatesFilter<"RestaurantSettings"> | string
    openingSlots?: StringWithAggregatesFilter<"RestaurantSettings"> | string
    depositPerGuestCents?: IntWithAggregatesFilter<"RestaurantSettings"> | number
  }

  export type DayOverrideWhereInput = {
    AND?: DayOverrideWhereInput | DayOverrideWhereInput[]
    OR?: DayOverrideWhereInput[]
    NOT?: DayOverrideWhereInput | DayOverrideWhereInput[]
    id?: IntFilter<"DayOverride"> | number
    date?: DateTimeFilter<"DayOverride"> | Date | string
    closed?: BoolFilter<"DayOverride"> | boolean
    maxCovers?: IntNullableFilter<"DayOverride"> | number | null
    openingSlots?: StringNullableFilter<"DayOverride"> | string | null
  }

  export type DayOverrideOrderByWithRelationInput = {
    id?: SortOrder
    date?: SortOrder
    closed?: SortOrder
    maxCovers?: SortOrderInput | SortOrder
    openingSlots?: SortOrderInput | SortOrder
  }

  export type DayOverrideWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    date?: Date | string
    AND?: DayOverrideWhereInput | DayOverrideWhereInput[]
    OR?: DayOverrideWhereInput[]
    NOT?: DayOverrideWhereInput | DayOverrideWhereInput[]
    closed?: BoolFilter<"DayOverride"> | boolean
    maxCovers?: IntNullableFilter<"DayOverride"> | number | null
    openingSlots?: StringNullableFilter<"DayOverride"> | string | null
  }, "id" | "date">

  export type DayOverrideOrderByWithAggregationInput = {
    id?: SortOrder
    date?: SortOrder
    closed?: SortOrder
    maxCovers?: SortOrderInput | SortOrder
    openingSlots?: SortOrderInput | SortOrder
    _count?: DayOverrideCountOrderByAggregateInput
    _avg?: DayOverrideAvgOrderByAggregateInput
    _max?: DayOverrideMaxOrderByAggregateInput
    _min?: DayOverrideMinOrderByAggregateInput
    _sum?: DayOverrideSumOrderByAggregateInput
  }

  export type DayOverrideScalarWhereWithAggregatesInput = {
    AND?: DayOverrideScalarWhereWithAggregatesInput | DayOverrideScalarWhereWithAggregatesInput[]
    OR?: DayOverrideScalarWhereWithAggregatesInput[]
    NOT?: DayOverrideScalarWhereWithAggregatesInput | DayOverrideScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"DayOverride"> | number
    date?: DateTimeWithAggregatesFilter<"DayOverride"> | Date | string
    closed?: BoolWithAggregatesFilter<"DayOverride"> | boolean
    maxCovers?: IntNullableWithAggregatesFilter<"DayOverride"> | number | null
    openingSlots?: StringNullableWithAggregatesFilter<"DayOverride"> | string | null
  }

  export type GiftCardWhereInput = {
    AND?: GiftCardWhereInput | GiftCardWhereInput[]
    OR?: GiftCardWhereInput[]
    NOT?: GiftCardWhereInput | GiftCardWhereInput[]
    id?: StringFilter<"GiftCard"> | string
    createdAt?: DateTimeFilter<"GiftCard"> | Date | string
    updatedAt?: DateTimeFilter<"GiftCard"> | Date | string
    code?: StringFilter<"GiftCard"> | string
    amount?: FloatFilter<"GiftCard"> | number
    recipientEmail?: StringNullableFilter<"GiftCard"> | string | null
    personalMessage?: StringNullableFilter<"GiftCard"> | string | null
    isPaid?: BoolFilter<"GiftCard"> | boolean
    status?: EnumGiftCardStatusFilter<"GiftCard"> | $Enums.GiftCardStatus
    stripeSessionId?: StringNullableFilter<"GiftCard"> | string | null
    expiresAt?: DateTimeNullableFilter<"GiftCard"> | Date | string | null
    transactionExpireAt?: DateTimeNullableFilter<"GiftCard"> | Date | string | null
    usedAt?: DateTimeNullableFilter<"GiftCard"> | Date | string | null
  }

  export type GiftCardOrderByWithRelationInput = {
    id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    code?: SortOrder
    amount?: SortOrder
    recipientEmail?: SortOrderInput | SortOrder
    personalMessage?: SortOrderInput | SortOrder
    isPaid?: SortOrder
    status?: SortOrder
    stripeSessionId?: SortOrderInput | SortOrder
    expiresAt?: SortOrderInput | SortOrder
    transactionExpireAt?: SortOrderInput | SortOrder
    usedAt?: SortOrderInput | SortOrder
  }

  export type GiftCardWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    code?: string
    stripeSessionId?: string
    AND?: GiftCardWhereInput | GiftCardWhereInput[]
    OR?: GiftCardWhereInput[]
    NOT?: GiftCardWhereInput | GiftCardWhereInput[]
    createdAt?: DateTimeFilter<"GiftCard"> | Date | string
    updatedAt?: DateTimeFilter<"GiftCard"> | Date | string
    amount?: FloatFilter<"GiftCard"> | number
    recipientEmail?: StringNullableFilter<"GiftCard"> | string | null
    personalMessage?: StringNullableFilter<"GiftCard"> | string | null
    isPaid?: BoolFilter<"GiftCard"> | boolean
    status?: EnumGiftCardStatusFilter<"GiftCard"> | $Enums.GiftCardStatus
    expiresAt?: DateTimeNullableFilter<"GiftCard"> | Date | string | null
    transactionExpireAt?: DateTimeNullableFilter<"GiftCard"> | Date | string | null
    usedAt?: DateTimeNullableFilter<"GiftCard"> | Date | string | null
  }, "id" | "code" | "stripeSessionId">

  export type GiftCardOrderByWithAggregationInput = {
    id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    code?: SortOrder
    amount?: SortOrder
    recipientEmail?: SortOrderInput | SortOrder
    personalMessage?: SortOrderInput | SortOrder
    isPaid?: SortOrder
    status?: SortOrder
    stripeSessionId?: SortOrderInput | SortOrder
    expiresAt?: SortOrderInput | SortOrder
    transactionExpireAt?: SortOrderInput | SortOrder
    usedAt?: SortOrderInput | SortOrder
    _count?: GiftCardCountOrderByAggregateInput
    _avg?: GiftCardAvgOrderByAggregateInput
    _max?: GiftCardMaxOrderByAggregateInput
    _min?: GiftCardMinOrderByAggregateInput
    _sum?: GiftCardSumOrderByAggregateInput
  }

  export type GiftCardScalarWhereWithAggregatesInput = {
    AND?: GiftCardScalarWhereWithAggregatesInput | GiftCardScalarWhereWithAggregatesInput[]
    OR?: GiftCardScalarWhereWithAggregatesInput[]
    NOT?: GiftCardScalarWhereWithAggregatesInput | GiftCardScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"GiftCard"> | string
    createdAt?: DateTimeWithAggregatesFilter<"GiftCard"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"GiftCard"> | Date | string
    code?: StringWithAggregatesFilter<"GiftCard"> | string
    amount?: FloatWithAggregatesFilter<"GiftCard"> | number
    recipientEmail?: StringNullableWithAggregatesFilter<"GiftCard"> | string | null
    personalMessage?: StringNullableWithAggregatesFilter<"GiftCard"> | string | null
    isPaid?: BoolWithAggregatesFilter<"GiftCard"> | boolean
    status?: EnumGiftCardStatusWithAggregatesFilter<"GiftCard"> | $Enums.GiftCardStatus
    stripeSessionId?: StringNullableWithAggregatesFilter<"GiftCard"> | string | null
    expiresAt?: DateTimeNullableWithAggregatesFilter<"GiftCard"> | Date | string | null
    transactionExpireAt?: DateTimeNullableWithAggregatesFilter<"GiftCard"> | Date | string | null
    usedAt?: DateTimeNullableWithAggregatesFilter<"GiftCard"> | Date | string | null
  }

  export type ReservationCreateInput = {
    id?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    name: string
    email: string
    phone?: string | null
    date: Date | string
    guests: number
    specialRequest?: string | null
    wantsSmsReminder?: boolean
    status?: $Enums.ReservationStatus
    stripeSessionId?: string | null
    expiresAt?: Date | string | null
    transactionExpireAt?: Date | string | null
    reminderEmailSent?: boolean
    reminderSmsSent?: boolean
    cancelToken?: string
  }

  export type ReservationUncheckedCreateInput = {
    id?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    name: string
    email: string
    phone?: string | null
    date: Date | string
    guests: number
    specialRequest?: string | null
    wantsSmsReminder?: boolean
    status?: $Enums.ReservationStatus
    stripeSessionId?: string | null
    expiresAt?: Date | string | null
    transactionExpireAt?: Date | string | null
    reminderEmailSent?: boolean
    reminderSmsSent?: boolean
    cancelToken?: string
  }

  export type ReservationUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    guests?: IntFieldUpdateOperationsInput | number
    specialRequest?: NullableStringFieldUpdateOperationsInput | string | null
    wantsSmsReminder?: BoolFieldUpdateOperationsInput | boolean
    status?: EnumReservationStatusFieldUpdateOperationsInput | $Enums.ReservationStatus
    stripeSessionId?: NullableStringFieldUpdateOperationsInput | string | null
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    transactionExpireAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    reminderEmailSent?: BoolFieldUpdateOperationsInput | boolean
    reminderSmsSent?: BoolFieldUpdateOperationsInput | boolean
    cancelToken?: StringFieldUpdateOperationsInput | string
  }

  export type ReservationUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    guests?: IntFieldUpdateOperationsInput | number
    specialRequest?: NullableStringFieldUpdateOperationsInput | string | null
    wantsSmsReminder?: BoolFieldUpdateOperationsInput | boolean
    status?: EnumReservationStatusFieldUpdateOperationsInput | $Enums.ReservationStatus
    stripeSessionId?: NullableStringFieldUpdateOperationsInput | string | null
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    transactionExpireAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    reminderEmailSent?: BoolFieldUpdateOperationsInput | boolean
    reminderSmsSent?: BoolFieldUpdateOperationsInput | boolean
    cancelToken?: StringFieldUpdateOperationsInput | string
  }

  export type ReservationCreateManyInput = {
    id?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    name: string
    email: string
    phone?: string | null
    date: Date | string
    guests: number
    specialRequest?: string | null
    wantsSmsReminder?: boolean
    status?: $Enums.ReservationStatus
    stripeSessionId?: string | null
    expiresAt?: Date | string | null
    transactionExpireAt?: Date | string | null
    reminderEmailSent?: boolean
    reminderSmsSent?: boolean
    cancelToken?: string
  }

  export type ReservationUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    guests?: IntFieldUpdateOperationsInput | number
    specialRequest?: NullableStringFieldUpdateOperationsInput | string | null
    wantsSmsReminder?: BoolFieldUpdateOperationsInput | boolean
    status?: EnumReservationStatusFieldUpdateOperationsInput | $Enums.ReservationStatus
    stripeSessionId?: NullableStringFieldUpdateOperationsInput | string | null
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    transactionExpireAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    reminderEmailSent?: BoolFieldUpdateOperationsInput | boolean
    reminderSmsSent?: BoolFieldUpdateOperationsInput | boolean
    cancelToken?: StringFieldUpdateOperationsInput | string
  }

  export type ReservationUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    guests?: IntFieldUpdateOperationsInput | number
    specialRequest?: NullableStringFieldUpdateOperationsInput | string | null
    wantsSmsReminder?: BoolFieldUpdateOperationsInput | boolean
    status?: EnumReservationStatusFieldUpdateOperationsInput | $Enums.ReservationStatus
    stripeSessionId?: NullableStringFieldUpdateOperationsInput | string | null
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    transactionExpireAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    reminderEmailSent?: BoolFieldUpdateOperationsInput | boolean
    reminderSmsSent?: BoolFieldUpdateOperationsInput | boolean
    cancelToken?: StringFieldUpdateOperationsInput | string
  }

  export type AdminCreateInput = {
    email: string
    passwordHash: string
    createdAt?: Date | string
  }

  export type AdminUncheckedCreateInput = {
    id?: number
    email: string
    passwordHash: string
    createdAt?: Date | string
  }

  export type AdminUpdateInput = {
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AdminUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AdminCreateManyInput = {
    id?: number
    email: string
    passwordHash: string
    createdAt?: Date | string
  }

  export type AdminUpdateManyMutationInput = {
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AdminUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RestaurantSettingsCreateInput = {
    id?: number
    maxCovers?: number
    mealDuration?: number
    openingDays?: string
    openingSlots?: string
    depositPerGuestCents?: number
  }

  export type RestaurantSettingsUncheckedCreateInput = {
    id?: number
    maxCovers?: number
    mealDuration?: number
    openingDays?: string
    openingSlots?: string
    depositPerGuestCents?: number
  }

  export type RestaurantSettingsUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    maxCovers?: IntFieldUpdateOperationsInput | number
    mealDuration?: IntFieldUpdateOperationsInput | number
    openingDays?: StringFieldUpdateOperationsInput | string
    openingSlots?: StringFieldUpdateOperationsInput | string
    depositPerGuestCents?: IntFieldUpdateOperationsInput | number
  }

  export type RestaurantSettingsUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    maxCovers?: IntFieldUpdateOperationsInput | number
    mealDuration?: IntFieldUpdateOperationsInput | number
    openingDays?: StringFieldUpdateOperationsInput | string
    openingSlots?: StringFieldUpdateOperationsInput | string
    depositPerGuestCents?: IntFieldUpdateOperationsInput | number
  }

  export type RestaurantSettingsCreateManyInput = {
    id?: number
    maxCovers?: number
    mealDuration?: number
    openingDays?: string
    openingSlots?: string
    depositPerGuestCents?: number
  }

  export type RestaurantSettingsUpdateManyMutationInput = {
    id?: IntFieldUpdateOperationsInput | number
    maxCovers?: IntFieldUpdateOperationsInput | number
    mealDuration?: IntFieldUpdateOperationsInput | number
    openingDays?: StringFieldUpdateOperationsInput | string
    openingSlots?: StringFieldUpdateOperationsInput | string
    depositPerGuestCents?: IntFieldUpdateOperationsInput | number
  }

  export type RestaurantSettingsUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    maxCovers?: IntFieldUpdateOperationsInput | number
    mealDuration?: IntFieldUpdateOperationsInput | number
    openingDays?: StringFieldUpdateOperationsInput | string
    openingSlots?: StringFieldUpdateOperationsInput | string
    depositPerGuestCents?: IntFieldUpdateOperationsInput | number
  }

  export type DayOverrideCreateInput = {
    date: Date | string
    closed?: boolean
    maxCovers?: number | null
    openingSlots?: string | null
  }

  export type DayOverrideUncheckedCreateInput = {
    id?: number
    date: Date | string
    closed?: boolean
    maxCovers?: number | null
    openingSlots?: string | null
  }

  export type DayOverrideUpdateInput = {
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    closed?: BoolFieldUpdateOperationsInput | boolean
    maxCovers?: NullableIntFieldUpdateOperationsInput | number | null
    openingSlots?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type DayOverrideUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    closed?: BoolFieldUpdateOperationsInput | boolean
    maxCovers?: NullableIntFieldUpdateOperationsInput | number | null
    openingSlots?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type DayOverrideCreateManyInput = {
    id?: number
    date: Date | string
    closed?: boolean
    maxCovers?: number | null
    openingSlots?: string | null
  }

  export type DayOverrideUpdateManyMutationInput = {
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    closed?: BoolFieldUpdateOperationsInput | boolean
    maxCovers?: NullableIntFieldUpdateOperationsInput | number | null
    openingSlots?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type DayOverrideUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    closed?: BoolFieldUpdateOperationsInput | boolean
    maxCovers?: NullableIntFieldUpdateOperationsInput | number | null
    openingSlots?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type GiftCardCreateInput = {
    id?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    code: string
    amount: number
    recipientEmail?: string | null
    personalMessage?: string | null
    isPaid?: boolean
    status?: $Enums.GiftCardStatus
    stripeSessionId?: string | null
    expiresAt?: Date | string | null
    transactionExpireAt?: Date | string | null
    usedAt?: Date | string | null
  }

  export type GiftCardUncheckedCreateInput = {
    id?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    code: string
    amount: number
    recipientEmail?: string | null
    personalMessage?: string | null
    isPaid?: boolean
    status?: $Enums.GiftCardStatus
    stripeSessionId?: string | null
    expiresAt?: Date | string | null
    transactionExpireAt?: Date | string | null
    usedAt?: Date | string | null
  }

  export type GiftCardUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    code?: StringFieldUpdateOperationsInput | string
    amount?: FloatFieldUpdateOperationsInput | number
    recipientEmail?: NullableStringFieldUpdateOperationsInput | string | null
    personalMessage?: NullableStringFieldUpdateOperationsInput | string | null
    isPaid?: BoolFieldUpdateOperationsInput | boolean
    status?: EnumGiftCardStatusFieldUpdateOperationsInput | $Enums.GiftCardStatus
    stripeSessionId?: NullableStringFieldUpdateOperationsInput | string | null
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    transactionExpireAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    usedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type GiftCardUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    code?: StringFieldUpdateOperationsInput | string
    amount?: FloatFieldUpdateOperationsInput | number
    recipientEmail?: NullableStringFieldUpdateOperationsInput | string | null
    personalMessage?: NullableStringFieldUpdateOperationsInput | string | null
    isPaid?: BoolFieldUpdateOperationsInput | boolean
    status?: EnumGiftCardStatusFieldUpdateOperationsInput | $Enums.GiftCardStatus
    stripeSessionId?: NullableStringFieldUpdateOperationsInput | string | null
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    transactionExpireAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    usedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type GiftCardCreateManyInput = {
    id?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    code: string
    amount: number
    recipientEmail?: string | null
    personalMessage?: string | null
    isPaid?: boolean
    status?: $Enums.GiftCardStatus
    stripeSessionId?: string | null
    expiresAt?: Date | string | null
    transactionExpireAt?: Date | string | null
    usedAt?: Date | string | null
  }

  export type GiftCardUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    code?: StringFieldUpdateOperationsInput | string
    amount?: FloatFieldUpdateOperationsInput | number
    recipientEmail?: NullableStringFieldUpdateOperationsInput | string | null
    personalMessage?: NullableStringFieldUpdateOperationsInput | string | null
    isPaid?: BoolFieldUpdateOperationsInput | boolean
    status?: EnumGiftCardStatusFieldUpdateOperationsInput | $Enums.GiftCardStatus
    stripeSessionId?: NullableStringFieldUpdateOperationsInput | string | null
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    transactionExpireAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    usedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type GiftCardUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    code?: StringFieldUpdateOperationsInput | string
    amount?: FloatFieldUpdateOperationsInput | number
    recipientEmail?: NullableStringFieldUpdateOperationsInput | string | null
    personalMessage?: NullableStringFieldUpdateOperationsInput | string | null
    isPaid?: BoolFieldUpdateOperationsInput | boolean
    status?: EnumGiftCardStatusFieldUpdateOperationsInput | $Enums.GiftCardStatus
    stripeSessionId?: NullableStringFieldUpdateOperationsInput | string | null
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    transactionExpireAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    usedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type EnumReservationStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.ReservationStatus | EnumReservationStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ReservationStatus[] | ListEnumReservationStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ReservationStatus[] | ListEnumReservationStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumReservationStatusFilter<$PrismaModel> | $Enums.ReservationStatus
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type ReservationCountOrderByAggregateInput = {
    id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    name?: SortOrder
    email?: SortOrder
    phone?: SortOrder
    date?: SortOrder
    guests?: SortOrder
    specialRequest?: SortOrder
    wantsSmsReminder?: SortOrder
    status?: SortOrder
    stripeSessionId?: SortOrder
    expiresAt?: SortOrder
    transactionExpireAt?: SortOrder
    reminderEmailSent?: SortOrder
    reminderSmsSent?: SortOrder
    cancelToken?: SortOrder
  }

  export type ReservationAvgOrderByAggregateInput = {
    guests?: SortOrder
  }

  export type ReservationMaxOrderByAggregateInput = {
    id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    name?: SortOrder
    email?: SortOrder
    phone?: SortOrder
    date?: SortOrder
    guests?: SortOrder
    specialRequest?: SortOrder
    wantsSmsReminder?: SortOrder
    status?: SortOrder
    stripeSessionId?: SortOrder
    expiresAt?: SortOrder
    transactionExpireAt?: SortOrder
    reminderEmailSent?: SortOrder
    reminderSmsSent?: SortOrder
    cancelToken?: SortOrder
  }

  export type ReservationMinOrderByAggregateInput = {
    id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    name?: SortOrder
    email?: SortOrder
    phone?: SortOrder
    date?: SortOrder
    guests?: SortOrder
    specialRequest?: SortOrder
    wantsSmsReminder?: SortOrder
    status?: SortOrder
    stripeSessionId?: SortOrder
    expiresAt?: SortOrder
    transactionExpireAt?: SortOrder
    reminderEmailSent?: SortOrder
    reminderSmsSent?: SortOrder
    cancelToken?: SortOrder
  }

  export type ReservationSumOrderByAggregateInput = {
    guests?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type EnumReservationStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ReservationStatus | EnumReservationStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ReservationStatus[] | ListEnumReservationStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ReservationStatus[] | ListEnumReservationStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumReservationStatusWithAggregatesFilter<$PrismaModel> | $Enums.ReservationStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumReservationStatusFilter<$PrismaModel>
    _max?: NestedEnumReservationStatusFilter<$PrismaModel>
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type AdminCountOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    passwordHash?: SortOrder
    createdAt?: SortOrder
  }

  export type AdminAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type AdminMaxOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    passwordHash?: SortOrder
    createdAt?: SortOrder
  }

  export type AdminMinOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    passwordHash?: SortOrder
    createdAt?: SortOrder
  }

  export type AdminSumOrderByAggregateInput = {
    id?: SortOrder
  }

  export type RestaurantSettingsCountOrderByAggregateInput = {
    id?: SortOrder
    maxCovers?: SortOrder
    mealDuration?: SortOrder
    openingDays?: SortOrder
    openingSlots?: SortOrder
    depositPerGuestCents?: SortOrder
  }

  export type RestaurantSettingsAvgOrderByAggregateInput = {
    id?: SortOrder
    maxCovers?: SortOrder
    mealDuration?: SortOrder
    depositPerGuestCents?: SortOrder
  }

  export type RestaurantSettingsMaxOrderByAggregateInput = {
    id?: SortOrder
    maxCovers?: SortOrder
    mealDuration?: SortOrder
    openingDays?: SortOrder
    openingSlots?: SortOrder
    depositPerGuestCents?: SortOrder
  }

  export type RestaurantSettingsMinOrderByAggregateInput = {
    id?: SortOrder
    maxCovers?: SortOrder
    mealDuration?: SortOrder
    openingDays?: SortOrder
    openingSlots?: SortOrder
    depositPerGuestCents?: SortOrder
  }

  export type RestaurantSettingsSumOrderByAggregateInput = {
    id?: SortOrder
    maxCovers?: SortOrder
    mealDuration?: SortOrder
    depositPerGuestCents?: SortOrder
  }

  export type IntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type DayOverrideCountOrderByAggregateInput = {
    id?: SortOrder
    date?: SortOrder
    closed?: SortOrder
    maxCovers?: SortOrder
    openingSlots?: SortOrder
  }

  export type DayOverrideAvgOrderByAggregateInput = {
    id?: SortOrder
    maxCovers?: SortOrder
  }

  export type DayOverrideMaxOrderByAggregateInput = {
    id?: SortOrder
    date?: SortOrder
    closed?: SortOrder
    maxCovers?: SortOrder
    openingSlots?: SortOrder
  }

  export type DayOverrideMinOrderByAggregateInput = {
    id?: SortOrder
    date?: SortOrder
    closed?: SortOrder
    maxCovers?: SortOrder
    openingSlots?: SortOrder
  }

  export type DayOverrideSumOrderByAggregateInput = {
    id?: SortOrder
    maxCovers?: SortOrder
  }

  export type IntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type FloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type EnumGiftCardStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.GiftCardStatus | EnumGiftCardStatusFieldRefInput<$PrismaModel>
    in?: $Enums.GiftCardStatus[] | ListEnumGiftCardStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.GiftCardStatus[] | ListEnumGiftCardStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumGiftCardStatusFilter<$PrismaModel> | $Enums.GiftCardStatus
  }

  export type GiftCardCountOrderByAggregateInput = {
    id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    code?: SortOrder
    amount?: SortOrder
    recipientEmail?: SortOrder
    personalMessage?: SortOrder
    isPaid?: SortOrder
    status?: SortOrder
    stripeSessionId?: SortOrder
    expiresAt?: SortOrder
    transactionExpireAt?: SortOrder
    usedAt?: SortOrder
  }

  export type GiftCardAvgOrderByAggregateInput = {
    amount?: SortOrder
  }

  export type GiftCardMaxOrderByAggregateInput = {
    id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    code?: SortOrder
    amount?: SortOrder
    recipientEmail?: SortOrder
    personalMessage?: SortOrder
    isPaid?: SortOrder
    status?: SortOrder
    stripeSessionId?: SortOrder
    expiresAt?: SortOrder
    transactionExpireAt?: SortOrder
    usedAt?: SortOrder
  }

  export type GiftCardMinOrderByAggregateInput = {
    id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    code?: SortOrder
    amount?: SortOrder
    recipientEmail?: SortOrder
    personalMessage?: SortOrder
    isPaid?: SortOrder
    status?: SortOrder
    stripeSessionId?: SortOrder
    expiresAt?: SortOrder
    transactionExpireAt?: SortOrder
    usedAt?: SortOrder
  }

  export type GiftCardSumOrderByAggregateInput = {
    amount?: SortOrder
  }

  export type FloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type EnumGiftCardStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.GiftCardStatus | EnumGiftCardStatusFieldRefInput<$PrismaModel>
    in?: $Enums.GiftCardStatus[] | ListEnumGiftCardStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.GiftCardStatus[] | ListEnumGiftCardStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumGiftCardStatusWithAggregatesFilter<$PrismaModel> | $Enums.GiftCardStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumGiftCardStatusFilter<$PrismaModel>
    _max?: NestedEnumGiftCardStatusFilter<$PrismaModel>
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type EnumReservationStatusFieldUpdateOperationsInput = {
    set?: $Enums.ReservationStatus
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type FloatFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type EnumGiftCardStatusFieldUpdateOperationsInput = {
    set?: $Enums.GiftCardStatus
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedEnumReservationStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.ReservationStatus | EnumReservationStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ReservationStatus[] | ListEnumReservationStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ReservationStatus[] | ListEnumReservationStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumReservationStatusFilter<$PrismaModel> | $Enums.ReservationStatus
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedEnumReservationStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ReservationStatus | EnumReservationStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ReservationStatus[] | ListEnumReservationStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ReservationStatus[] | ListEnumReservationStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumReservationStatusWithAggregatesFilter<$PrismaModel> | $Enums.ReservationStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumReservationStatusFilter<$PrismaModel>
    _max?: NestedEnumReservationStatusFilter<$PrismaModel>
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type NestedEnumGiftCardStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.GiftCardStatus | EnumGiftCardStatusFieldRefInput<$PrismaModel>
    in?: $Enums.GiftCardStatus[] | ListEnumGiftCardStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.GiftCardStatus[] | ListEnumGiftCardStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumGiftCardStatusFilter<$PrismaModel> | $Enums.GiftCardStatus
  }

  export type NestedFloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type NestedEnumGiftCardStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.GiftCardStatus | EnumGiftCardStatusFieldRefInput<$PrismaModel>
    in?: $Enums.GiftCardStatus[] | ListEnumGiftCardStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.GiftCardStatus[] | ListEnumGiftCardStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumGiftCardStatusWithAggregatesFilter<$PrismaModel> | $Enums.GiftCardStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumGiftCardStatusFilter<$PrismaModel>
    _max?: NestedEnumGiftCardStatusFilter<$PrismaModel>
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}